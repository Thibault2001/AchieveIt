import logo from './logo.svg';
import './App.css';
import './Event.css';
import Event from './Event.js';

function App() {
  const events = [{
    id: 1,
    title: "Event 1",
    type: "University",
    date: "2023-08-18",
    description: "Today I have an  assignment to do that I want to do. I really really want to and now I'm just trying to fill up lines in this description space so it looks more full. "
  },
  {
    id: 2,
    title: "Event 2",
    type: "Birthday",
    date: "2023-09-21",
    description: "Someone's birthday"
  },
  {
    id: 3,
    title: "Event 3",
    type: "Sports",
    date: "2023-09-21",
    description: "Today I really want to play some football and do other sports stuff. I really really want to and now I'm just trying to fill up lines in this description space so it looks more full. "
  }
  ];
  return (
    <div className='eventHolder'>
      {
        events.map(event => (
          <Event
            key={event.id}
            title={event.title}
            type={event.type}
            date={event.date}
            description={event.description}
          />
        ))
      }
    </div>
  );
}

export default App;
