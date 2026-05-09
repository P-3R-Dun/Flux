from djoser.serializers import UserSerializer

class CustomUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = tuple(UserSerializer.Meta.fields) + ('first_name', 'last_name')
