# from fastapi import FastAPI

# app = FastAPI(
#     title="Financial AI Assistant",
#     version="0.1.0"
# )

# @app.get("/")
# async def root():
#     return {
#         "status": "running",
#         "message": "Financial AI Assistant"
#     }



from fastapi import FastAPI

from apps.api.routers.chat import router as chat_router

app = FastAPI(
    title="Financial AI Assistant"
)

app.include_router(chat_router)


@app.get("/")
def root():
    return {
        "status": "running",
        "message": "Financial AI Assistant"
    }