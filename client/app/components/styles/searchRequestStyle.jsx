
export default {
	body: {
      fontFamily: "'Open Sans', sans-serif",
      backgroundColor: '#f7f7f7',
      margin: 0,
      padding: 0,
      minHeight: '100%',
    },

    backgroundLargeHeader: {
      width: '100%',
      minHeight: '400px',
      backgroundColor: 'rgb(1, 28, 35)',
      // backgroundImage: 'radial-gradient(circle, #004c67 0, #005771 120%)',
      zIndex: 1,
      marginBottom: '-100px'
    },

    backgroundSmallHeader: {
      width: '100%',
      minHeight: '300px',
      backgroundColor: '#011c23',
      zIndex: 1,
      marginBottom: '-100px'
    },

    requestWrapper: {
      maxWidth: '1200px',
      margin: 'auto',
      paddingTop: '10px',
      backgroundColor: 'white',
      position: 'relative',
      zIndex: '10',
      boxShadow: '0 1px 2px grey',
    },

    pageTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    },

    pageTitleLargeSpan: {
      color: 'white',
      fontSize: '4em',
      marginTop: '4vh',
      marginBottom: '6vh'
    },

    pageTitleSmallSpan: {
      color: 'white',
      fontSize: '2em',
      marginTop: '3vh',
      marginBottom: '3vh'
    },    

    box: {
      height: '50px',
    },

    searchLargeContainer: {
      margin: '0 25%',
    },

    searchSmallContainer: {
      margin: '0 10%',
    },

    searchIcon: {
      position: 'absolute',
      fontSize: '1.2em',
      marginTop: '12px',
      marginLeft: '-13px',
      color: '#4f5b66'
    },

    searchLargeBar: {
      width: '100%',
      height: '50px',
      background: '#ffffff',
      border: 'none',
      fontSize: '10pt',
      float: 'left',
      color: '#63717f',
      paddingLeft: '45px',
      marginLeft: '-25px',
      borderRadius: '5px',
    },

    searchSmallBar: {
      width: '100%',
      height: '50px',
      background: '#ffffff',
      border: 'none',
      fontSize: '13pt',
      float: 'left',
      color: '#63717f',
      paddingLeft: '45px',
      marginLeft: '-25px',
      borderRadius: '5px',
    },

    searchFilterActive: {
      color: '#00d17c',
      fontSize: '1em',
      marginLeft: '10px',
      cursor: 'pointer'
    },

    searchFilterNotActive: {
      color: 'white',
      fontSize: '1em',
      marginLeft: '10px',
      cursor: 'pointer'
    },


    filter: {
      color: 'white',
      paddingLeft: '40px',
      width: '60%',
    },

    resultLargeHeader: {
      paddingLeft: '30px',
      color: 'black',
      fontSize: '1.6em',
    },

    resultSmallHeader: {
      paddingLeft: '12px',
      color: 'black',
      fontSize: '1.4em',
    },
}