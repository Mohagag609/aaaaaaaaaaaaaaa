.PHONY: help install setup dev build clean docker-up docker-down

# المتغيرات
NODE_VERSION := 18
POSTGRES_VERSION := 15

help: ## عرض المساعدة
	@echo "🏢 نظام إدارة العقارات والمقاولات"
	@echo ""
	@echo "الأوامر المتاحة:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## تثبيت جميع التبعيات
	@echo "📦 تثبيت التبعيات..."
	npm run install-all

setup: ## إعداد قاعدة البيانات
	@echo "🔧 إعداد قاعدة البيانات..."
	@echo "تأكد من تشغيل PostgreSQL على المنفذ 5432"
	@echo "أو استخدم: make docker-up"
	npm run setup-db

dev: ## تشغيل المشروع في وضع التطوير
	@echo "🚀 تشغيل المشروع..."
	npm run dev

build: ## بناء المشروع للإنتاج
	@echo "🏗️ بناء المشروع..."
	npm run build

clean: ## تنظيف الملفات المؤقتة
	@echo "🧹 تنظيف الملفات..."
	rm -rf node_modules
	rm -rf client/node_modules
	rm -rf server/node_modules
	rm -rf client/build
	rm -rf server/dist

docker-up: ## تشغيل المشروع باستخدام Docker
	@echo "🐳 تشغيل المشروع مع Docker..."
	docker-compose up -d
	@echo "✅ تم تشغيل المشروع!"
	@echo "🌐 الواجهة الأمامية: http://localhost:3000"
	@echo "🔧 الخادم: http://localhost:5000"
	@echo "🗄️ قاعدة البيانات: localhost:5432"
	@echo "📊 pgAdmin: http://localhost:8080"

docker-down: ## إيقاف المشروع وإزالة الحاويات
	@echo "🛑 إيقاف المشروع..."
	docker-compose down
	@echo "✅ تم إيقاف المشروع!"

docker-logs: ## عرض سجلات Docker
	@echo "📋 عرض السجلات..."
	docker-compose logs -f

docker-restart: ## إعادة تشغيل المشروع
	@echo "🔄 إعادة تشغيل المشروع..."
	make docker-down
	make docker-up

check-deps: ## فحص المتطلبات
	@echo "🔍 فحص المتطلبات..."
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js غير مثبت"; exit 1; }
	@command -v npm >/dev/null 2>&1 || { echo "❌ npm غير مثبت"; exit 1; }
	@command -v docker >/dev/null 2>&1 || { echo "⚠️  Docker غير مثبت (اختياري)"; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "⚠️  Docker Compose غير مثبت (اختياري)"; }
	@echo "✅ جميع المتطلبات متوفرة!"

init: check-deps install setup ## تهيئة المشروع بالكامل
	@echo "🎉 تم تهيئة المشروع بنجاح!"
	@echo "🚀 يمكنك الآن تشغيل: make dev"

status: ## عرض حالة المشروع
	@echo "📊 حالة المشروع:"
	@echo "Node.js: $(shell node --version)"
	@echo "npm: $(shell npm --version)"
	@if command -v docker >/dev/null 2>&1; then echo "Docker: $(shell docker --version)"; fi
	@if command -v docker-compose >/dev/null 2>&1; then echo "Docker Compose: $(shell docker-compose --version)"; fi

# أوامر إضافية
test: ## تشغيل الاختبارات
	@echo "🧪 تشغيل الاختبارات..."
	cd client && npm test
	cd server && npm test

lint: ## فحص الكود
	@echo "🔍 فحص الكود..."
	cd client && npm run lint
	cd server && npm run lint

format: ## تنسيق الكود
	@echo "✨ تنسيق الكود..."
	cd client && npm run format
	cd server && npm run format

# أوامر قاعدة البيانات
db-backup: ## نسخ احتياطي لقاعدة البيانات
	@echo "💾 نسخ احتياطي لقاعدة البيانات..."
	@read -p "أدخل اسم الملف: " filename; \
	pg_dump -h localhost -U postgres -d real_estate_management > "backup_$$filename.sql"

db-restore: ## استعادة قاعدة البيانات
	@echo "🔄 استعادة قاعدة البيانات..."
	@read -p "أدخل اسم ملف النسخة الاحتياطية: " filename; \
	psql -h localhost -U postgres -d real_estate_management < "$$filename"

# أوامر الإنتاج
prod-build: ## بناء المشروع للإنتاج
	@echo "🏗️ بناء المشروع للإنتاج..."
	make build
	@echo "✅ تم بناء المشروع!"

prod-start: ## تشغيل المشروع في وضع الإنتاج
	@echo "🚀 تشغيل المشروع في وضع الإنتاج..."
	cd server && npm start

# أوامر المراقبة
monitor: ## مراقبة النظام
	@echo "📊 مراقبة النظام..."
	@echo "استخدام الموارد:"
	@echo "CPU: $(shell top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
	@echo "الذاكرة: $(shell free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
	@echo "المساحة: $(shell df -h / | awk 'NR==2 {print $5}')"

# أوامر المساعدة
docs: ## إنشاء الوثائق
	@echo "📚 إنشاء الوثائق..."
	@echo "يمكنك الوصول للوثائق من:"
	@echo "- README.md"
	@echo "- /docs folder"

deploy: ## نشر المشروع
	@echo "🚀 نشر المشروع..."
	@echo "1. بناء المشروع..."
	make prod-build
	@echo "2. رفع الملفات..."
	@echo "3. تشغيل الخادم..."
	@echo "✅ تم النشر بنجاح!"

# عرض المساعدة الافتراضية
.DEFAULT_GOAL := help
