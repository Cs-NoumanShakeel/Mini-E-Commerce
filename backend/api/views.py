from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from .models import Product, Order,User
from .serializers import ProductSerializer, OrderSerializer,UserSerializer
from .permissions import IsStaffUser
from django_filters.rest_framework import DjangoFilterBackend
from .pagination import CustomPagination
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OrderItems
from rest_framework.pagination import PageNumberPagination

class OrderPagination(PageNumberPagination):
    page_size = 5


# views.py
class OrderItemUpdateView(APIView):
    def patch(self, request, order_id):
        product_id = request.data.get("item_id") 
        quantity = request.data.get("quantity")

        try:
            order_item = OrderItems.objects.get(order_id=order_id, product_id=product_id)
            order_item.quantity = quantity
            order_item.save()
            return Response({"message": "✅ Quantity updated"}, status=status.HTTP_200_OK)
        except OrderItems.DoesNotExist:
            return Response({"error": "❌ Item not found"}, status=status.HTTP_404_NOT_FOUND)





class ProductFilterSearchMixin:
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,filters.OrderingFilter]
    filterset_fields = ['created_at', 'price', 'stock']
    search_fields = ['name', 'id']

class OrderFilterSearchMixin:
    filter_backends = [DjangoFilterBackend, filters.SearchFilter,filters.OrderingFilter]
    filterset_fields = ['ordered_at', 'status']
    search_fields = ['ordered_items__product__name', 'id']


class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation Errors:", serializer.errors)  # Helps you debug
            return Response(serializer.errors, status=400)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)


class ProductListCreateView(ProductFilterSearchMixin, generics.ListCreateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = CustomPagination

    def get_permissions(self):
        return [IsStaffUser()] if self.request.method == 'POST' else [AllowAny()]


class ProductDeleteView(ProductFilterSearchMixin, generics.DestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffUser]


class ProductUpdateView(ProductFilterSearchMixin, generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsStaffUser]


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        return {'request': self.request}




from rest_framework.permissions import IsAuthenticated

class OrderListView(OrderFilterSearchMixin, generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = OrderPagination


    def get_queryset(self):
        user = self.request.user
        print("Authenticated user:", user)

        if user.is_staff or user.is_superuser:
            return Order.objects.all()

        return Order.objects.filter(user=user)


class OrderDeleteView(OrderFilterSearchMixin, generics.DestroyAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        return Order.objects.all() if user.is_staff or user.is_superuser else Order.objects.filter(user=user)


class OrderUpdateView(OrderFilterSearchMixin, generics.UpdateAPIView):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        return Order.objects.all() if user.is_staff or user.is_superuser else Order.objects.filter(user=user)

