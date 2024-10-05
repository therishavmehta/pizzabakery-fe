import { ConfigProvider } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { AppLayout } from './components/container/Layout';

function App() {
  return (
    <Router>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#ff7e26',
            borderRadius: 2,
            colorBgContainer: '#fff4d6'
          },
          hashed: false
        }}
      >
        <AppLayout />
      </ConfigProvider>
    </Router>
  );
}

export default App;
