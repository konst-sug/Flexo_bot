#app.py
import logging
import asyncio

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
#from watchdog.observers.polling import PollingObserver
from api.security import mySecurity, create_access_token, authorized, registration_check
from api import db, ServiceRunner
from api.service import VoiceFileHandler, universal_extract_docs, shutdown_executor

logger = logging.basicConfig(level=Warning)
users_json = 'users.json'
users_dict = []
loop_ref = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("🚀 Starting background services...")
    global loop_ref
    loop_ref = asyncio.get_running_loop()

    # handler = VoiceFileHandler(loop=loop_ref)
    # observer = PollingObserver(timeout=60.0)
    # observer.schedule(handler, str(WATCH_PATH), recursive=False)
    # observer.start()

    await db.connect()
    await db.init_database()

    yield

    await db.disconnect()

    await shutdown_executor()
    logger.info("🛑 Stopping services...")
    # observer.stop()
    # observer.join()
    logger.info("Done.")

app = FastAPI(lifespan=lifespan)


@app.post("/extract")
async def extract(folders: list[str]):
    return await universal_extract_docs(folders)

@app.on_event("startup")
def connect_to_fake_db():
    app.state.users = db.get_users()
    users_dict = db.get_users()


@app.get('/', response_class=JSONResponse)
async def start_page(request: Request):
    pass


@app.post('/login')
async def user_page(request: Request, response: Response, login: str=Form(...), password: str = Form(...), 
                    auth_check=Depends(mySecurity)):
    user_info, users_dict = auth_check
    username = user_info['user_name']
    acc_token = create_access_token({"sub": username})
    response = JSONResponse('page.html', {'request': request, 'user': user_info, 'data': users_dict})
    response.set_cookie(
        key="Authorization",
        value=f"Bearer {acc_token}",
        path="/",       
        domain=None,    
        secure=False,   
        httponly=True,  
        samesite="lax"  
    )
    return response


@app.get('/register', response_class=JSONResponse)
async def registration_page(request: Request):
    pass


@app.post('/logout', response_class=JSONResponse)
async def logout_user(request: Request):
    pass


# @app.post("/commands/upload")
# async def upload(file: UploadFile):
#     dest = Path(WATCH_PATH) / file.filename
#     dest.write_bytes(await file.read())
#     return {"status": "queued"}