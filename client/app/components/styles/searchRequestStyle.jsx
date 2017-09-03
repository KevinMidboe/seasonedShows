
export default {
	body: {
      fontFamily: "'Open Sans', sans-serif",
      backgroundColor: '#f7f7f7',
      margin: 0,
      padding: 0,
      minHeight: '100%',
      position: 'relative'
    },

    backgroundHeader: {
      width: '100%',
      minHeight: '400px',
      backgroundColor: '#011c23',
      zIndex: 1,
      position: 'absolute'
    },

    requestWrapper: {
      top: '300px',
      width: '90%',
      maxWidth: '1200px',
      margin: 'auto',
      paddingTop: '20px',
      backgroundColor: 'white',
      position: 'relative',
      zIndex: '10',
      boxShadow: '0 2px 10px grey'
    },

    pageTitle: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    pageTitleSpan: {
      color: 'white',
      fontSize: '3em',
      marginTop: '4vh',
      marginBottom: '6vh'
    },

    box: {
      width: '90%',
      height: '50px',
      maxWidth: '1200px',
      margin: '0 auto'
    },

    container: {
      verticalAlign: 'middle',
      whiteSpace: 'nowrap',
      position: 'relative',
      display: 'flex',
      justifyContent: 'center'
    },

    searchIcon: {
      position: 'absolute',
      marginLeft: '17px',
      marginTop: '17px',
      zIndex: '1',
      color: '#4f5b66'
    },

    searchBar: {
      width: '60%',
      minWidth: '120px',
      height: '50px',
      background: '#ffffff',
      border: 'none',
      fontSize: '10pt',
      float: 'left',
      color: '#63717f',
      paddingLeft: '45px',
      borderRadius: '5px',
      marginRight: '15px'
    },

    searchFilter: {
      color: 'white',
      fontSize: '1em',
      paddingTop: '12px',
      marginBottom: '12px',
      marginLeft: '10px',
      cursor: 'pointer'
    },

    hvrUnderlineFromCenter: {
      color: 'white',
      fontSize: '1em',
      paddingTop: '12px',
      marginBottom: '12px',
      marginLeft: '10px',
      cursor: 'pointer',
      display: 'inline-block',
      verticalAlign: 'middle',
      WebkitTransform: 'perspective(1px) translateZ(0)',
      transform: 'perspective(1px) translateZ(0)',
      boxShadow: '0 0 1px transparent',
      position: 'relative',
      overflow: 'hidden',
      ':before': {
          content: "",
          position: 'absolute',
          zIndex: '-1',
          left: '50%',
          right: '50%',
          bottom: '0',
          background: '#00d17c',
          height: '2px',
          WebkitTransitionProperty: 'left, right',
          transitionProperty: 'left, right',
          WebkitTransitionDuration: '0.3s',
          transitionDuration: '0.3s',
          WebkitTransitionTimingFunction: 'ease-out',
          transitionTimingFunction: 'ease-out'
      },
      ':hover:before': {
        left: 0,
        right: 0
      },
      'focus:before': {
        left: 0,
        right: 0
      },
      'active:before': {
        left: 0,
        right: 0
      }
    }
}