from os import error
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import UserData
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):

    email = serializers.EmailField(
            required=True,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    username = serializers.CharField(
            required=True,
            max_length=32,
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8, write_only=True, required=True)

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )

        return user

    class Meta:
        model = User
        fields = ( "id", "username", "password", "email")

class JsonFileUpdateSerializer(serializers.ModelSerializer):
    username = serializers.CharField()
            
    class Meta:
        model = UserData    
        fields = ['id', 'username', 'jsonData']