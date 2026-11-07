import asyncpg


class AsyncPGDB:

    def __init__(self, host, port, database, user, password):
        self.host = host
        self.port = port
        self.database = database
        self.user = user
        self.password = password
        self._pool = None


    async def connect(self):
        """ Создаем пул соединений для PostgreSQL"""
        if not self._pool:
            self._pool = await asyncpg.create_pool(
                host=self.host,
                port=self.port,
                database=self.database,
                user=self.user,
                password=self.password,
                min_size=5, 
                max_size=20
            )


    async def disconnect(self): 
        if self._pool:
            await self._pool.close()
            self._pool = None


    async def close(self):
        """ Закрываем пул соединений"""
        if self._pool is not None:
            await self._pool.close()


    async def execute(self, logger, sql_query, *args):
        """Выполняем SQL-запросы."""
        conn = await self._pool.acquire()  # Получаем соединение из пула
        try:
            result = await conn.execute(sql_query, *args)
            return result
        except Exception as error:
            logger.error(f"Ошибка выполнения запроса: {sql_query}, ошибка: {error}")
            return False
        finally:
            await self._pool.release(conn)


    async def get_rows(self, full_query, logger, params=None):
        """
        Универсальная функция для извлечения данных из базы данных.
        Работает как с параметрами (params), так и без них.
        """
        conn = None
        try:
            if self._pool is None:
                raise RuntimeError("Pool of connections was not initialized!")
            conn = await self._pool.acquire()  # Берём соединение из пула
            if params is not None:
                rows = await conn.fetch(full_query, *list(params.values()))  # Выполнение запроса с параметрами
            else:
                rows = await conn.fetch(full_query)  # Выполнение простого запроса
            # Преобразуем результат в кортеж списков
            t_rows = []
            for record in rows:
                transformed_row = []
                for column_name in record.keys():
                    # transformed_row[column_name] = record[column_name]
                    transformed_row.append(record[column_name])
                t_rows.append(transformed_row)
            transformed_rows = tuple(t_rows)
            return transformed_rows
        except Exception as error:
            logger.error(f"Ошибка выполнения запроса: {full_query}, ошибка: {error}")
            return []
        finally:
            if conn is not None:  # Проверяем, было ли создано активное соединение
                await self._pool.release(conn)  # Освобождаем соединение обратно в пул

      
    async def insert_data(self, table, field_names: list, data):
        """Записываем данные из словаря в таблицу
        :param table_name: Название таблицы
        :param field_names: Список имен полей
        :param data: Данные для вставки (словарь или список значений)
        :return: Значение поля 'id' последней вставленной строки
        """
        returning_clause = 'RETURNING reg_num' if table != 'users' else ''
        if isinstance(data, list):
            # Если передан список, создаём фиктивный ключ и используем этот список
            data_dict = {"_default": data}
        else:
            data_dict = data
        results = []
        for key, values in data_dict.items():
            fields_str = ", ".join(field_names)
            placeholders = ', '.join(['$' + str(i+1) for i in range(len(values))])
            query = f"INSERT INTO {table} ({fields_str}) VALUES ({placeholders}) {returning_clause};"
            try:
                conn = await self._pool.acquire()  # Берём соединение из пула
                async with conn.transaction():     # Используем транзакцию для гарантированной целостности данных
                    result = await conn.fetchval(query, *values)
                    results.append(result)
            except Exception as error:
                print(f"Ошибка вставки данных: {error}")
                continue
            finally:
                await self._pool.release(conn)      # Освобождаем соединение назад в пул
        return results if len(results) > 1 else results[0]


    async def fetch_chunked(self, logger, full_query, chunk_size=10, offset=0, order_condition=None):
        """Извлекает данные из базы данных постранично.
        Используется для больших объемов данных."""

        # Формируем запрос с LIMIT и OFFSET для пагинации
        paginated_query = f"{full_query} {order_condition} LIMIT {chunk_size} OFFSET {offset};"
        try:
            conn = await self._pool.acquire()
            rows = await conn.fetch(paginated_query)
        except Exception as error:
            logger.error(f"Ошибка выполнения запроса: {paginated_query}, ошибка: {error}")
        finally:
            await self._pool.release(conn)
        return rows


    async def get_count(self, logger, sql_query, *args):
            """
            Выполняем SQL-запросы.
            """
            conn = await self._pool.acquire()  # Получаем соединение из пула
            try:
                result = await conn.fetchval(sql_query, *args)
                return result
            except Exception as error:
                logger.error(f"Ошибка выполнения запроса: {sql_query}, ошибка: {error}")
                return False
            finally:
                await self._pool.release(conn)


    async def update_records(self, table, logger, *args):
        conn = await self._pool.acquire()
        update_fields, conditions = args
        query, values = form_update_query(table, update_fields, conditions)
        try:
            state = await conn.execute(query, *values)
        except Exception as error:
            logger.error(f"Ошибка выполнения запроса: {query}, ошибка: {error}")
            return False
        finally:
            if conn is not None:
                await self._pool.release(conn)
        return state


    async def del_record(self, table, logger, *args):
            query = f"DELETE FROM {table} WHERE user_name=$1;"
            args = args
            conn = await self._pool.acquire()
            try:
                result = await conn.execute(query, *args)
            except Exception as error:
                logger.error(f"Ошибка выполнения запроса: {query}, ошибка: {error}")
                result = False
            finally:
                if conn is not None:
                    await self._pool.release(conn)
            return result


def form_update_query(table, set_values, where_conditions):
    updates = []
    params = []
    param_counter = 1
    for column, value in set_values.items():
        updates.append(f"{column}=${param_counter}")
        params.append(value)
        param_counter += 1
    wheres = []
    for column, value in where_conditions.items():
        wheres.append(f"{column}=${param_counter}")
        params.append(value)
        param_counter += 1
    sql = f"UPDATE {table} SET {', '.join(updates)} WHERE {' AND '.join(wheres)};"
    return sql, params
