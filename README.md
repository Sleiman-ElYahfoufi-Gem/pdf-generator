# PDF Generator

A simple PDF generator built with Express.js, Handlebars, and Puppeteer.

## Features

- Form-based PDF generation
- Input validation using Zod
- Clean MVC architecture
- Handlebars templating

## Tech Stack

- **Express.js** - Web framework
- **Handlebars** - Templating engine
- **Puppeteer** - PDF generation
- **Zod** - Input validation

## Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd pdf-generator
```

2. Install dependencies
```bash
npm install
```

3. Run the application
```bash
npm run dev
```

## Usage

1. Start the server with `npm run dev`
2. Open your browser and navigate to: **http://localhost:8080/api/pdf/pdf-form**
3. Fill out the form with:
   - Username (min 3 characters)
   - Email (valid email format)
   - Country (min 2 characters)
   - Description (min 10 characters)
4. Click "Generate PDF" to download your PDF

## API Endpoints

- `GET /api/pdf/pdf-form` - Display the PDF generation form
- `POST /api/pdf/generate-pdf` - Generate and download PDF

## Project Structure

```
pdf-generator/
├── controllers/        # Request handlers
├── services/          # Business logic (PDF generation)
├── routes/            # Route definitions
├── validations/       # Input validation schemas
├── views/             # Handlebars templates
├── server.js          # Application entry point
└── package.json
```

## Scripts

- `npm start` - Run the server in production mode
- `npm run dev` - Run the server in development mode with auto-restart

