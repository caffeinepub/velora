import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import DailyProgramScreen from './screens/DailyProgramScreen';
import PremiumFeaturesScreen from './screens/PremiumFeaturesScreen';
import TextSoftlyScreen from './screens/TextSoftlyScreen';
import JournalScreen from './screens/JournalScreen';
import ProfileScreen from './screens/ProfileScreen';
import AppLayout from './components/layout/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/welcome',
  component: WelcomeScreen
});

const dailyProgramRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-program',
  component: DailyProgramScreen
});

const premiumFeaturesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/premium',
  component: PremiumFeaturesScreen
});

const textSoftlyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/text-softly',
  component: TextSoftlyScreen
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: JournalScreen
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfileScreen
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  welcomeRoute,
  dailyProgramRoute,
  premiumFeaturesRoute,
  textSoftlyRoute,
  journalRoute,
  profileRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
