#!/bin/sh
set -e

echo "⏳ Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  sleep 2
done

echo "🚀 Running migrations..."
node scripts/run-migrations.js

echo "🌱 Running seeds..."
node scripts/run-seeds.js

echo "✅ Starting backend..."
node src/server.js
