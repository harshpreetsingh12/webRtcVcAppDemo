import { Routes, Route} from 'react-router-dom'
import HomePage from './pages/Home';

import { SocketProvider } from './providers/Socket';
import { PeerProvider } from './providers/Peer';
import RoomPage from './pages/Room';

function App() {
  return (
    <div className="App">
      <PeerProvider>
        <SocketProvider>
          <Routes>
            <Route path='/' element={<HomePage/>} />
            <Route path='/room/:roomId' element={<RoomPage/>} />
          </Routes>
        </SocketProvider>
      </PeerProvider>
    </div>
  );
}

export default App;
