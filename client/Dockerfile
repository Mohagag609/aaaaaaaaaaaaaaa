FROM node:18-alpine

# تعيين مجلد العمل
WORKDIR /app

# نسخ ملفات التبعيات
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci

# نسخ الكود المصدري
COPY . .

# تعريض المنفذ
EXPOSE 3000

# أمر التشغيل
CMD ["npm", "start"]
