FROM python:3.12-slim-buster

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Install ruff and format
RUN pip install ruff
RUN ruff format .
RUN ruff check . --fix

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
