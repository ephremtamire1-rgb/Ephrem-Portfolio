# Database Schema Definition

This document outlines the data structure used by the portfolio application. These models were previously implemented in MongoDB/Sequelize and are now documented here for your reference.

## 1. User (Profile)
| Field | Type | Description |
|-------|------|-------------|
| name | String | Full name of the portfolio owner |
| bio | String | Professional biography |
| image | String | Profile image URL |
| title | String | Professional title (e.g., Full Stack Developer) |
| email | String | Contact email |
| phones | Array<String> | List of contact phone numbers |
| socials | Object | Nested object containing social links (instagram, whatsapp, etc.) |

## 2. Project
| Field | Type | Description |
|-------|------|-------------|
| title | String | Name of the project |
| description | String | Brief project summary |
| image | String | Project thumbnail URL |
| category | String | Project category (Web, Mobile, 3D, etc.) |

## 3. Skill
| Field | Type | Description |
|-------|------|-------------|
| name | String | Name of the technology/skill |
| level | Number | Proficiency level (0-100) |

## 4. Education
| Field | Type | Description |
|-------|------|-------------|
| degree | String | Name of the degree/certification |
| institution | String | School or organization name |
| year | String | Graduation year or period |

## 5. Experience
| Field | Type | Description |
|-------|------|-------------|
| position | String | Job title |
| company | String | Company name |
| period | String | Tenure period |

## 6. Service
| Field | Type | Description |
|-------|------|-------------|
| title | String | Name of the service offered |
| desc | String | Description of the service |
| image | String | Icon or representative image URL |

## 7. Message (Chat)
| Field | Type | Description |
|-------|------|-------------|
| sender | String | Name of message sender |
| text | String | Content of the message |
| timestamp | Date | Time message was sent |
| isAdmin | Boolean | True if sent by site owner |
| type | Enum | 'text', 'image', or 'file' |
| fileUrl | String | URL of attachment if applicable |
| fileName | String | Original name of attachment |
| status | Enum | 'sent', 'delivered', 'read' |

## 8. Settings
| Field | Type | Description |
|-------|------|-------------|
| theme | Enum | 'dark' or 'light' |
