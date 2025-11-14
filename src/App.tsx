import './App.css'
import {Route, Routes, BrowserRouter} from 'react-router-dom'
import Registration from './pages/Registration/Registration'
import LoginScreen from './pages/Login/Login'


function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<LoginScreen></LoginScreen>}></Route>
        <Route path="/cadastro" element={<Registration />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
