from typing_extensions import Required
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)

# Create your models here.

class UserData(models.Model):
    # username = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userDatausername")
    username = models.CharField(blank=False, null=False, max_length=15, unique=True)
    jsonData = models.FileField(blank=True, default='', upload_to="media")
