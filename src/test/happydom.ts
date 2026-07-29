import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Separate preload file: must register before @testing-library is imported.
GlobalRegistrator.register();
