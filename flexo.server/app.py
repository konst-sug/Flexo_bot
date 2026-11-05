#app.py
import logging

from fastapi import FastAPI, Request, Response, HTTPException, Depends, Form
from fastapi.responses import JSONResponse
from api.security import mySecurity, create_access_token, authorized, registration_check
from api import db_driver, ServiceRunner

app = FastAPI()

logger = logging.basicConfig(level=Warning)
users_json = 'users.json'
users_dict = []


@app.on_event("startup")
def connect_to_fake_db():
    app.state.users = db_driver.get_users()
    users_dict = db_driver.get_users()


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
