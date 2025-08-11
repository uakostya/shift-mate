# ShiftMate - Shift Work Schedule Website

A modern, responsive web application for creating and sharing shift work schedules. Built with Angular 19, featuring internationalization support for English and Ukrainian languages.

## Deploy To GitHub Pages

ng deploy --base-href=/shift-mate/

## 🚀 Features

### Core Functionality

- **Schedule Creation (FR001)**: Create new shift work schedules with customizable parameters
- **Calendar View (FR002)**: Interactive calendar displaying work and rest days
- **Responsive Design (FR003)**: Optimized for mobile, tablet, and desktop devices

### Key Capabilities

- ✅ **URL-based Schedule Sharing**: Generate shareable links for schedules
- ✅ **No Database Required**: All calculations done client-side
- ✅ **Internationalization**: English (default) and Ukrainian language support
- ✅ **Modern UI**: Clean, accessible design with visual day indicators
- ✅ **Mobile Responsive**: Works seamlessly across all device sizes

## 🛠 Technology Stack

- **Frontend**: Angular 19 with standalone components
- **Styling**: Custom CSS with utility classes (responsive design)
- **Internationalization**: Angular i18n
- **Build System**: Angular CLI with esbuild
- **TypeScript**: Latest version with strict mode

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── schedule-setup.component.ts    # Schedule creation form
│   │   └── schedule-view.component.ts     # Calendar display
│   ├── models/
│   │   └── schedule.model.ts              # TypeScript interfaces
│   ├── services/
│   │   └── schedule.service.ts            # Business logic
│   ├── app.component.ts                   # Root component
│   ├── app.config.ts                      # App configuration
│   └── app.routes.ts                      # Routing configuration
├── locale/
│   ├── messages.en.xlf                    # English translations
│   └── messages.uk.xlf                    # Ukrainian translations
└── styles.scss                           # Global styles
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v19 or higher)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd shift-mate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   ng serve
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Building for Production

```bash
# Build for English (default)
ng build

# Build for Ukrainian
ng build --configuration production --localize
```

## 📖 How to Use

### Creating a Schedule

1. **Access the Setup Page**: Navigate to the home page
2. **Fill in Schedule Details**:
   - Schedule Name (optional)
   - Start Date
   - Number of Working Days
   - Number of Rest Days
   - Shift Times (optional)
3. **Generate Schedule**: Click "Create Schedule"
4. **Share or View**: Copy the generated URL or view the calendar

### Viewing a Schedule

1. **Access via URL**: Open a shared schedule URL
2. **Navigate Calendar**: Use arrow buttons to browse months
3. **Interpret Colors**:
   - 🟢 Green: Working days
   - 🔴 Red: Rest days
   - 🔵 Blue: Current day

## 🌐 URL Parameters

Schedules are encoded in the URL using these parameters:

| Parameter | Description               | Example         |
| --------- | ------------------------- | --------------- |
| `start`   | Start date (YYYY-MM-DD)   | `2025-08-11`    |
| `work`    | Number of working days    | `2`             |
| `rest`    | Number of rest days       | `2`             |
| `time`    | Shift times (HH:MM-HH:MM) | `08:00-16:00`   |
| `name`    | Schedule name             | `My%20Schedule` |

**Example URL:**

```
http://localhost:4200/schedule?start=2025-08-11&work=2&rest=2&time=08:00-16:00&name=Day%20Shift
```

## 🌍 Internationalization

The application supports two languages:

- **English** (default): `en`
- **Ukrainian**: `uk`

### Adding New Languages

1. Extract messages: `ng extract-i18n`
2. Create new translation file: `src/locale/messages.[locale].xlf`
3. Translate all `<target>` elements
4. Update `angular.json` with new locale configuration

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

Key responsive features:

- Flexible grid layouts
- Touch-friendly buttons
- Readable typography at all sizes
- Optimized calendar view for mobile

## 🧪 Development

### Available Scripts

```bash
# Development server
npm start

# Build application
npm run build

# Run tests
npm test

# Extract i18n messages
ng extract-i18n

# Lint code
ng lint
```

### Code Style

- TypeScript strict mode enabled
- Angular style guide compliance
- OnPush change detection strategy
- Standalone components
- Signal-based reactivity

## 🏗 Architecture

### Design Patterns

- **Standalone Components**: No NgModules required
- **Reactive Programming**: Angular Signals for state management
- **Service Layer**: Business logic separated from components
- **URL-based State**: No backend persistence needed

### Key Services

- **ScheduleService**: Core business logic for schedule calculations
- **Router**: Navigation and URL parameter handling

## 🔧 Configuration

### Angular Configuration

- Standalone application architecture
- i18n enabled with polyfills
- SCSS support
- Development server HMR enabled

### Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Requirements Compliance

| Requirement              | Status      | Implementation                                |
| ------------------------ | ----------- | --------------------------------------------- |
| FR001: Schedule Creation | ✅ Complete | `ScheduleSetupComponent` with form validation |
| FR002: Calendar View     | ✅ Complete | `ScheduleViewComponent` with monthly calendar |
| FR003: Responsive Design | ✅ Complete | CSS Grid + Flexbox with mobile-first approach |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- None currently reported

## 🚀 Future Enhancements

- [ ] Print-friendly calendar view
- [ ] Multiple schedule management
- [ ] Calendar export functionality
- [ ] Theme customization
- [ ] PWA capabilities

---

**Built with ❤️ using Angular 19**
