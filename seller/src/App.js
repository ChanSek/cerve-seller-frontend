import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './utils/Theme';
import OndcRoutes from "./Router/Router";
import "./Api/firebase-init";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <OndcRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;
