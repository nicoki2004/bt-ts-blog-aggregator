# TypeScript Blog Aggregator

A command-line application for aggregating and managing RSS blog feeds. 
Built with TypeScript, featuring user authentication, feed management, and post browsing capabilities.

## Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (v10.30.1 or compatible version)
- **PostgreSQL** database (running and accessible)
- See tech stack for ORM and Parsing.

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ts-blog-aggregator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up the database:
   ```bash
   pnpm run generate
   pnpm run migrate
   ```

## Configuration

The application requires a configuration file at `~/.gatorconfig.json` (in your home directory) with the following structure:

```json
{
  "db_url": "postgres://username:password@localhost:5432/database_name",
  "current_user_name": "your_username"
}
```

### Configuration Fields:
- **db_url**: PostgreSQL connection string for your database
- **current_user_name**: The currently logged-in user (updated automatically when you login)

### Example PostgreSQL Connection String:
```
postgres://postgres:password@localhost:5432/blog_aggregator
```

## Running the Application

### Development Mode (with hot reload):
```bash
pnpm run dev
```

### Production Mode:
```bash
pnpm run start
```

### Basic Usage:
```bash
pnpm start <command> [arguments]
```

## Available Commands

### User Management
- **`register <username>`** - Register a new user
- **`login <username>`** - Login as an existing user (sets the current user in config)
- **`users`** - List all registered users
- **`reset`** - Reset all users (clears the database)

### Feed Management
- **`addfeed <feed_name> <url>`** - Add a new RSS feed and follow it automatically
- **`feeds`** - List all available feeds
- **`follow <feed_url>`** - Follow an existing feed
- **`following`** - List feeds you're currently following
- **`unfollow <feed_url>`** - Unfollow a feed
- **`agg <url>`** - Aggregate posts from a URL

### Content Browsing
- **`browse`** - View posts from your followed feeds

## Example Workflow

1. Register a new user:
   ```bash
   pnpm start register alice
   ```

2. Add a blog feed:
   ```bash
   pnpm start addfeed "TechBlog" "https://example.com/feed.xml"
   ```

3. View your following feeds:
   ```bash
   pnpm start following
   ```

4. Browse posts:
   ```bash
   pnpm start browse
   ```

## Project Structure

```
src/
├── commands/          # CLI command handlers
├── config/            # Configuration file management
├── lib/
│   ├── db/           # Database schema and queries
│   ├── time.ts       # Time utilities
│   └── rss/          # RSS parsing utilities
├── middleware/        # Middleware (login checks, etc.)
└── index.ts          # Application entry point
```

## Technology Stack

- **Language**: TypeScript
- **Runtime**: Node.js with tsx
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **RSS Parsing**: fast-xml-parser
- **Package Manager**: pnpm
