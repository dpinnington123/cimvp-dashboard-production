# Database Schema Documentation

## Overview

The Change Influence MVP Dashboard uses a Supabase PostgreSQL database to power a sophisticated **content evaluation and optimization platform**. The database is designed to support systematic content review workflows, scoring criteria application, and performance analytics for marketing content.

**Database Details:**
- **Project Name:** change_influence_mvp
- **Project Reference ID:** gbzrparwhkacvfasltbe
- **Region:** West US (North California)
- **Database Type:** PostgreSQL (via Supabase)

## Database Architecture

The database consists of **12 main tables** organized into four functional domains:

### 1. Core Content Management
- `content` - Primary content storage
- `content_reviews` - Content evaluation records
- `scores` - Individual scoring data

### 2. Review & Analysis System
- `category_review_summaries` - Aggregated category performance
- `checks` - Evaluation criteria definitions
- `check_categories` - Check organization structure

### 3. Format & Content Type Management
- `formats` - Content format definitions
- `format_checks` - Format-specific check associations

### 4. Research & Knowledge Base
- `topics` - High-level research areas
- `subtopics` - Detailed topic breakdowns
- `subtopic_checks` - Topic-specific check associations
- `Research Topics` - Additional research data

## Table Specifications

### Content Management Tables

#### `content`
**Purpose:** Primary storage for all marketing content (ads, campaigns, creative assets)

| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` (PK) | Unique content identifier |
| `content_name` | `string` (Required) | Display name for the content |
| `agency` | `string` | Agency responsible for content |
| `audience` | `string` | Target audience specification |
| `bucket_id` | `string` | Storage bucket reference |
| `campaign_aligned_to` | `string` | Associated campaign |
| `client_id` | `string` | Client/user identifier |
| `content_objectives` | `string` | Business objectives |
| `expiry_date` | `string` | Content expiration date |
| `eye_tracking_path` | `string` | Eye tracking data file path |
| `file_storage_path` | `string` | Content file location |
| `format` | `string` | Content format type |
| `funnel_alignment` | `string` | Marketing funnel stage |
| `status` | `string` | Content status (draft, active, etc.) |
| `strategy_aligned_to` | `string` | Strategic alignment |
| `type` | `string` | Content type classification |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last modification timestamp |

#### `content_reviews`
**Purpose:** Tracks review sessions and overall evaluations for content pieces

| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` (PK) | Unique review identifier |
| `content_id` | `number` (FK) | References `content.id` |
| `client_id` | `string` | Reviewer identifier |
| `confidence` | `number` | Review confidence level |
| `notes` | `string` | Review notes |
| `overall_comments` | `string` | General feedback |
| `overall_score` | `number` | Aggregate review score |
| `reviewed_at` | `string` | Review completion timestamp |
| `reviewer_stage` | `string` | Review workflow stage |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `content_id` → `content.id` (Many reviews per content piece)

#### `scores`
**Purpose:** Individual scoring data for specific evaluation criteria within reviews

| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` (PK) | Unique score identifier |
| `content_review_id` | `number` (FK) | References `content_reviews.id` |
| `check_id` | `number` | References evaluation check |
| `check_name` | `string` | Name of the evaluation check |
| `check_sub_category` | `string` | Check subcategory |
| `client_id` | `string` | Scorer identifier |
| `comments` | `string` | Specific feedback for this check |
| `confidence` | `number` | Confidence in this score |
| `fix_recommendation` | `string` | Improvement suggestions |
| `score_value` | `number` | Numerical score value |
| `created_at` | `string` | Score creation timestamp |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `content_review_id` → `content_reviews.id` (Many scores per review)

### Review & Analysis System Tables

#### `category_review_summaries`
**Purpose:** Aggregated performance data by category for content reviews

| Column | Type | Description |
|--------|------|-------------|
| `id` | `number` (PK) | Unique summary identifier |
| `content_review_id` | `number` (FK) | References `content_reviews.id` |
| `category_name` | `string` | Category being summarized |
| `category_score` | `number` | Average category score |
| `client_id` | `string` | Client identifier |
| `summary_comment` | `string` | Category-level feedback |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `content_review_id` → `content_reviews.id` (Multiple summaries per review)

#### `checks`
**Purpose:** Defines individual evaluation criteria used in content assessment

| Column | Type | Description |
|--------|------|-------------|
| `check_id` | `number` (PK) | Unique check identifier |
| `check_name` | `string` (Required) | Check display name |
| `category_id` | `number` (FK) | References `check_categories.category_id` |
| `bad_score` | `string` (Required) | Description of poor performance |
| `good_score` | `string` (Required) | Description of good performance |
| `how_to_analyze` | `string` (Required) | Analysis instructions |
| `what_it_measures` | `string` (Required) | Purpose and scope |
| `scoring_scale` | `string` | Scoring methodology |
| `sub_group` | `string` | Check subcategorization |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `category_id` → `check_categories.category_id` (Many checks per category)

#### `check_categories`
**Purpose:** Organizational structure for grouping related evaluation checks

| Column | Type | Description |
|--------|------|-------------|
| `category_id` | `number` (PK) | Unique category identifier |
| `category_name` | `string` (Required) | Category display name |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

### Format & Content Type Management Tables

#### `formats`
**Purpose:** Defines different content formats and their characteristics

| Column | Type | Description |
|--------|------|-------------|
| `format_id` | `number` (PK) | Unique format identifier |
| `format_name` | `string` (Required) | Format display name |
| `audience_type` | `string` | Target audience type |
| `best_use_cases` | `string` | Optimal usage scenarios |
| `category` | `string` | Format categorization |
| `content_types` | `string` | Compatible content types |
| `cost_content_creation` | `string` | Creation cost information |
| `cost_distribution` | `string` | Distribution cost information |
| `engagement_metric` | `string` | Key performance indicators |
| `notes` | `string` | Additional format notes |
| `restrictions` | `string` | Usage limitations |
| `typical_usage` | `string` | Common applications |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

#### `format_checks`
**Purpose:** Associates specific evaluation checks with content formats

| Column | Type | Description |
|--------|------|-------------|
| `format_check_id` | `number` (PK) | Unique association identifier |
| `format_id` | `number` (FK) | References `formats.format_id` |
| `check_id` | `number` (FK) | References `checks.check_id` |
| `priority_level` | `string` | Check importance for this format |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `format_id` → `formats.format_id` (Many checks per format)
- `check_id` → `checks.check_id` (Many formats per check)

### Research & Knowledge Base Tables

#### `topics`
**Purpose:** High-level research areas and knowledge domains

| Column | Type | Description |
|--------|------|-------------|
| `topic_id` | `number` (PK) | Unique topic identifier |
| `topic_name` | `string` (Required) | Topic display name |
| `research_status` | `string` | Research completion status |
| `researched` | `boolean` | Research completion flag |
| `topic_summary` | `string` | Topic overview |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

#### `subtopics`
**Purpose:** Detailed breakdowns of main research topics

| Column | Type | Description |
|--------|------|-------------|
| `subtopic_id` | `number` (PK) | Unique subtopic identifier |
| `topic_id` | `number` (FK) | References `topics.topic_id` |
| `subtopic_name` | `string` (Required) | Subtopic display name |
| `subtopic_description` | `string` | Detailed description |
| `subtopic_slug` | `string` | URL-friendly identifier |
| `fix_recommendation` | `string` | Improvement guidance |
| `tags` | `string` | Classification tags |
| `what_bad_looks_like` | `string` | Poor performance indicators |
| `what_good_looks_like` | `string` | Good performance indicators |
| `why_important` | `string` | Importance explanation |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `topic_id` → `topics.topic_id` (Many subtopics per topic)

#### `subtopic_checks`
**Purpose:** Associates evaluation checks with specific subtopics

| Column | Type | Description |
|--------|------|-------------|
| `subtopic_check_id` | `number` (PK) | Unique association identifier |
| `subtopic_id` | `number` (FK) | References `subtopics.subtopic_id` |
| `check_id` | `number` (FK) | References `checks.check_id` |
| `created_at` | `string` | Creation timestamp |
| `updated_at` | `string` | Last update timestamp |

**Relationships:**
- `subtopic_id` → `subtopics.subtopic_id` (Many checks per subtopic)
- `check_id` → `checks.check_id` (Many subtopics per check)

#### `Research Topics`
**Purpose:** Additional research topic data storage

| Column | Type | Description |
|--------|------|-------------|
| `High Level Topic` | `string` | Research topic name |

## Data Flow & Relationships

### Primary Content Workflow
```
content → content_reviews → scores
                         → category_review_summaries
```

### Evaluation System
```
check_categories → checks → scores
                         → format_checks → formats
                         → subtopic_checks → subtopics → topics
```

### Key Relationships Summary

1. **Content to Reviews (1:Many):** Each content piece can have multiple reviews
2. **Reviews to Scores (1:Many):** Each review contains multiple individual check scores
3. **Reviews to Summaries (1:Many):** Each review generates category-level summaries
4. **Categories to Checks (1:Many):** Each category contains multiple evaluation checks
5. **Formats to Checks (Many:Many):** Checks can apply to multiple formats, formats can have multiple checks
6. **Topics to Subtopics (1:Many):** Each topic contains multiple subtopics
7. **Subtopics to Checks (Many:Many):** Checks can apply to multiple subtopics, subtopics can have multiple checks

## Authentication & Security

The database uses Supabase's built-in Row Level Security (RLS) with client-based access control:

- **Client ID Field:** Most tables include a `client_id` field for user-based data isolation
- **Authentication:** Handled via Supabase Auth with PKCE flow
- **Session Management:** Persistent sessions with automatic token refresh

## Usage Patterns

### Content Evaluation Process
1. Content is uploaded and stored in `content` table
2. Review session created in `content_reviews`
3. Individual checks evaluated and stored in `scores`
4. Category summaries generated in `category_review_summaries`

### Check Management
1. Categories defined in `check_categories`
2. Individual checks created in `checks` with category association
3. Checks associated with formats via `format_checks`
4. Checks associated with research topics via `subtopic_checks`

### Research Integration
1. High-level topics stored in `topics`
2. Detailed breakdowns in `subtopics`
3. Evaluation criteria linked via `subtopic_checks`

## Performance Considerations

- **Indexes:** Primary keys and foreign keys are automatically indexed
- **Relationships:** Foreign key constraints ensure data integrity
- **Timestamps:** All tables include creation and update timestamps for audit trails
- **Scalability:** Designed to handle multiple clients with proper data isolation

## Development Notes

- **Type Safety:** Full TypeScript type definitions generated from schema
- **Client Library:** Uses `@supabase/supabase-js` for database interactions
- **Environment:** Configured via `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Connection:** Supports both local development and production environments

---

*Last Updated: Generated from live database schema*
*Database Version: Current as of connection* 