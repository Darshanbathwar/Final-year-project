import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, useParams } from 'react-router-dom';
//import Sidebar from './Component/Sidebar';
import Dashboard from './Pages/Dashboard';
import CreateEvent from './Pages/CreateEvent';
import EditProduct from './Pages/EditPage';
import Header from './Components/Header';
import Login from './Pages/Login';

function App() {
  const [cardsData, setCardsData] = useState([]);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setShowCreateEvent(true);
  };

  const handleSave = (updatedCard) => {
    // Handle saving the updated card data, e.g., update state or make an API call
    console.log('Saving updated card:', updatedCard);
    setSelectedCard(null);
    setShowCreateEvent(false);
  };

  const addCard = (cardData) => {
    setCardsData((prevCardsData) => [...prevCardsData, cardData]);
  };

  const clearSelectedCard = () => {
    setSelectedCard(null);
  };
  return (
    
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path="/dashboard" element={<Dashboard cards={cardsData} onCardCreate={addCard}/>} />
        <Route path="/CreateEvent" element={<CreateEvent onCardCreate={addCard} />} />
        <Route
          path="/CreateEvent/:id"
          element={
            <CreateEvent
              cards={cardsData}
              selectedCard={selectedCard}
              onCardCreate={addCard}
              onSave={clearSelectedCard}
            />
          }
        />
        <Route path="/EditProduct/:productId" element={<EditProduct />} />
        
      </Routes>
    </Router>
  );
}

export default App;
