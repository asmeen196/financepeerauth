from django.urls import path
from .views import GetJsonData, UserCreate, UserLogin, UserJsonUpdate
from rest_framework.authtoken import views

urlpatterns = [
    path('create', UserCreate.as_view(), name='account-create'),
    path('login', UserLogin.as_view(), name='login'),
    path('api-token-auth/', views.obtain_auth_token),
    path('getJson', GetJsonData.as_view(), name='getJson'),
    path('updateJson', UserJsonUpdate, name='updateJson'),
]