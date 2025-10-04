# Contributing to Interview Preparator AI

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/interview-preparator-ai.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push and create a pull request

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with dev tools

### Installation
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies (optional)
cd ../server
npm install
```

### Running Tests
```bash
cd client
npm run typecheck
npm run lint
```

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use functional components and hooks
- Keep components focused and small

### Naming Conventions
- Components: PascalCase (`MyComponent.tsx`)
- Hooks: camelCase with `use` prefix (`useMyHook.ts`)
- Utilities: camelCase (`myUtility.ts`)
- Types/Interfaces: PascalCase (`MyType`, `MyInterface`)

### File Organization
- One component per file
- Co-locate related code (hooks with features)
- Keep imports organized (React, third-party, local)

## Testing Guidelines

### Unit Tests
- Test utility functions thoroughly
- Mock external dependencies
- Test edge cases and error handling

### Integration Tests
- Test user flows end-to-end
- Verify state management
- Test error boundaries

## Pull Request Process

1. **Update Documentation**: Update README if adding features
2. **Add Tests**: Include tests for new functionality
3. **Type Safety**: Ensure TypeScript compiles without errors
4. **Lint**: Run `npm run lint` and fix issues
5. **Description**: Clearly describe what and why in PR description
6. **Screenshots**: Include screenshots for UI changes

## Commit Messages

Follow conventional commits:

```
feat: Add question difficulty levels
fix: Resolve camera permission issue on Safari
docs: Update installation instructions
refactor: Simplify STAR analysis logic
test: Add tests for attention metrics
```

## Areas for Contribution

### High Priority
- [ ] Add unit tests for analysis modules
- [ ] Improve mobile responsiveness
- [ ] Add IndexedDB for session history
- [ ] Implement Whisper integration
- [ ] Add more question banks

### Medium Priority
- [ ] Add dark mode
- [ ] Improve accessibility (ARIA labels)
- [ ] Add keyboard shortcuts
- [ ] Performance optimizations
- [ ] Better error messages

### Nice to Have
- [ ] Emotion detection
- [ ] Multi-language support
- [ ] Question difficulty levels
- [ ] Progress tracking dashboard
- [ ] Export to PDF

## Code Review Criteria

- Code is clean and readable
- TypeScript types are accurate
- No console errors or warnings
- Follows existing patterns
- Includes documentation
- Handles errors gracefully

## Questions?

- Open an issue for bugs
- Start a discussion for feature ideas
- Tag maintainers for urgent issues

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
