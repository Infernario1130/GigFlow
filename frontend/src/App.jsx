import { BrowserRouter , Routes , Route } from "react-router-dom";
import UserLogin from "./pages/Login.jsx";
import UserSignup from "./pages/Signup.jsx";
import GigListings from "./pages/GigListings.jsx";
import BidListings from "./pages/BidListings.jsx";
import BidConfirmer from "./pages/BidConfirmer.jsx";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<UserLogin/>}/>
          <Route path="/signup" element={<UserSignup/>}/>
          <Route path="/gigs" element={<GigListings/>}/>
          <Route path="/gigs/:gigId" element={<BidListings/>}/>
          <Route path="/gigs/:gigId/bids" element={<BidConfirmer/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
