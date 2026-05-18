import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from main import app


client = TestClient(app)


def test_health_ok():
    """Test health check endpoint returns OK status"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "OK"}


def test_health_error_client_not_initialized():
    """Test health check endpoint returns ERROR when client is not initialized"""
    with patch('main.client', None):
        response = client.get("/health")
        assert response.status_code == 500
        assert response.json() == {"status": "ERROR"}


def test_health_error_exception():
    """Test health check endpoint returns ERROR when an exception occurs"""
    with patch('main.client', side_effect=Exception("Test error")):
        response = client.get("/health")
        assert response.status_code == 500
        assert response.json() == {"status": "ERROR"}
