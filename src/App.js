// import update from 'immutability-helper';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';

const containerStyle = {
  width: 400,
};

const cardStyle = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const Card = ({ text, id, index, moveCard }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: 'card',
    hover: (item, monitor) => {
      // console.log('hovering');
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      // console.dir(hoverBoundingRect)

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // console.log(hoverMiddleY)

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // console.log(clientOffset)

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // console.log(
      //   'clientOffset.y ' + clientOffset.y,
      //   'hoverBoundingRect.top ' + hoverBoundingRect.top,
      //   'hoverClientY ' + hoverClientY
      // )

      // Only perform the move when the mouse has crossed halof of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      //Dragging downwards
      // console.log(hoverClientY < hoverMiddleY)
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        // console.log(1111)
        return;
      }

      // if(dragIndex < hoverIndex) {
      //   // console.log(11)
      //   if(hoverClientY < hoverMiddleY) {
      //     // console.log(22)
      //     return;
      //   }
      //   // return;
      // }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        // console.log(2222)
        return;
      }

      // console.log(3333);

      moveCard(dragIndex, hoverIndex);

      // Hover index is automatically updated
      // but item's index is not
      // They both need to be update because the hover
      // function is always being called and it needs updated
      // indeces based on how things have moved on the screen
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'card',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => {
      return {
        isDragging: monitor.isDragging(),
      };
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div ref={ref} style={{ ...cardStyle, opacity }}>
      {text}
    </div>
  );
};

const App = () => {
  const [cards, setCards] = React.useState([
    {
      id: 1,
      text: 'Write a cool JS library',
    },
    {
      id: 2,
      text: 'Make it generic enough',
    },
    {
      id: 3,
      text: 'Write README',
    },
    {
      id: 4,
      text: 'Create some examples',
    },
    {
      id: 5,
      text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
    },
    {
      id: 6,
      text: '???',
    },
    {
      id: 7,
      text: 'PROFIT',
    },
  ]);
  const moveCard = React.useCallback((dragIndex, hoverIndex) => {
    setCards((prevCards) => {
      // Create a copy of the prevCards
      // Note: we are copying prevCards not cards.
      // Subtle but VERY important
      // On rerenders, cards will be updated to the initial array
      // which is not what we want when we are hovering
      // When rerenders happen because of hover,
      // we want to get the just updated cards (prevCards)
      const clonedCards = [...prevCards];
      const removedItem = clonedCards.splice(dragIndex, 1)[0];
      // console.log(removedItem, hoverIndex)
      clonedCards.splice(hoverIndex, 0, removedItem);
      // console.log(clonedCards)
      return clonedCards;
    });

    // React DnD's version
    // setCards((prevCards) =>
    //   update(prevCards, {
    //     $splice: [
    //       [dragIndex, 1],
    //       [hoverIndex, 0, prevCards[dragIndex]],
    //     ],
    //   })
    // );
  }, []);

  return (
    <div style={containerStyle}>
      {cards.map((card, index) => (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      ))}
    </div>
  );
};

export default App;
