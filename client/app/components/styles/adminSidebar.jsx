export default {
   header: {
      textAlign: 'center',
   },
   body: {
      backgroundColor: 'white',
   },

   parentElement: {
      display: 'inline-block',
      width: '100%',
      border: '1px solid grey',
      borderRadius: '2px',
      padding: '4px',
      margin: '4px',
      marginLeft: '4px',
      backgroundColor: 'white',
   },

   parentElement_hover: {
      backgroundColor: '#f8f8f8',
      pointer: 'hand',
   },

   parentElement_active: {
      textDecoration: 'none',
   },

   parentElement_selected: {
      display: 'inline-block',
      width: '100%',
      border: '1px solid grey',
      borderRadius: '2px',
      padding: '4px',
      margin: '4px 0px 4px 4px',
      marginLeft: '10px',
      backgroundColor: 'white',
   },

   title: {
      maxWidth: '65%',
      display: 'inline-flex',
   },

   link: {
      color: 'black',
      textDecoration: 'none',
   },

   rightContainer: {
      float: 'right',
   },



   searchSidebar: {
      height: '4em',
   },
   searchInner: {
      top: '0',
      right: '0',
      left: '0',
      bottom: '0',
      margin: 'auto',
      width: '90%',
      minWidth: '280px',
      height: '30px',
      border: '1px solid #d0d0d0',
      borderRadius: '4px',
      overflow: 'hidden'
   },
   searchTextField: {
      display: 'inline-block',
      width: '90%',
      padding: '.3em',
      verticalAlign: 'middle',
      border: 'none',
      background: '#fff',
      fontSize: '14px',
      marginTop: '-7px',
   },
   searchIcon: {
      width: '15px',
      height: '16px',
      marginRight: '4px',
      marginTop: '7px',
   },
   searchSVGIcon: {
      fill: 'none',
      stroke: '#9d9d9d',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeMiterlimit: '10',
   },


   ulFilterSelectors: {
      borderBottom: '2px solid #f1f1f1',
      display: 'flex',
      padding: '0',
      margin: '0',
      listStyle: 'none',
      justifyContent: 'space-evenly',
   },
   aFilterSelectors: {
      color: '#3eaaaf',
      fontSize: '16px',
      cursor: 'pointer',
   },
   spanFilterSelectors: {
      content: '""',
      bottom: '-2px',
      display: 'block',
      width: '100%',
      height: '2px',
      backgroundColor: '#3eaaaa',
   },


   ulCard: {
      margin: '1em 0 0 0',
      padding: '0',
      listStyle: 'none',
      borderBottom: '.46rem solid #f1f1f',
      backgroundColor: '#f1f1f1',
      overflow: 'scroll',
   },


   card: {
      padding: '.1em .5em .8em 1.5em',
      marginBottom: '.26rem',
      height: 'auto',
      cursor: 'pointer',
   },
   cardSelected: {
      padding: '.1em .5em .8em 1.5em',
      marginBottom: '.26rem',
      height: 'auto',
      cursor: 'pointer',

      backgroundColor: '#f9f9f9',
   },
   titleCard: {
      fontSize: '15px',
      fontWeight: '400',
      whiteSpace: 'no-wrap',
      textDecoration: 'none',
   },
   pCard: {
      margin: '0',
   },
}