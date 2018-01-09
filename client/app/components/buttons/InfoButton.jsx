import React, { Component } from 'react';
import Interactive from 'react-interactive';

import buttonsCSS from '../styles/buttons.jsx';


class InfoButton extends Component {
   constructor(props) {
      super(props);

      if (props) {
         this.state = {
            id: props.id,
            type: props.type,
         }
      }
   }

   componentWillReceiveProps(props) {
      this.setState({
         id: props.id,
         type: props.type,
      })
   }

   getTMDBLink() {
      const id = this.state.id;
      const type = this.state.type;

      if (type === 'movie') 
         return 'https://www.themoviedb.org/movie/' + id
      else if (type === 'show')  
         return 'https://www.themoviedb.org/tv/' + id
   }

   render() {
      return (
         <a href={this.getTMDBLink()}>
            <Interactive 
               as='button'
               hover={buttonsCSS.info_hover}
               focus={buttonsCSS.info_hover}
               style={buttonsCSS.info}>

               <span>More info</span>
            </Interactive>
         </a>
      );
   }
}

export default InfoButton;