from django.http.response import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.http import FileResponse
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, FileUploadParser
from rest_framework import status
from users.serializers import UserSerializer, JsonFileUpdateSerializer
from rest_framework.authtoken.models import Token
from .models import UserData
from django.core import serializers
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
import json
from pathlib import Path
import os

# Create your views here.

class UserCreate(APIView):
    """ 
    Creates the user. 
    """

    def post(self, request, format='json'):
        print("request data here ",request.data)
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.get(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response({"error":1, "msg":serializer.errors, "status":status.HTTP_400_BAD_REQUEST})

class UserLogin(APIView):
    """
    login user and provide token
    """

    def post(self, request, format='json'):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            return Response({"token": user.auth_token.key})
        else:
            return Response({"error": 1, "msg":"Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST','PATCH'])
def UserJsonUpdate(request, *args, **kwargs):
    parser_classes = (MultiPartParser, FormParser)

    if request.method == 'PATCH' or request.method == 'POST':

        serializer = JsonFileUpdateSerializer(data=request.data)
        if serializer.is_valid():
            instance, created = UserData.objects.update_or_create(username=serializer.validated_data.get('username', None), defaults=serializer.validated_data) 
            if not created:
                serializer.update(instance, serializer.validated_data)
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class GetJsonData(APIView):
    """ 
    Creates the user. 
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, format='json'):
        try:
            querySet = [UserData.objects.get(username=request.user)]
            qs_json = serializers.serialize('json', querySet)
            print(qs_json)
            BASE_DIR = Path(__file__).resolve().parent.parent
            path = 'media\\'+json.loads(qs_json)[0]['fields']['jsonData']
            jsonFile = open(os.path.join(BASE_DIR, path), 'rb')
            return FileResponse(jsonFile)
        except UserData.DoesNotExist:
            return Response(data={"error":"1","msg":"No data found"}, status=status.HTTP_400_BAD_REQUEST)
