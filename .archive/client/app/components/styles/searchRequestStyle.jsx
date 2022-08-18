
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
      minHeight: '180px',
      backgroundColor: 'rgb(1, 28, 35)',
      // backgroundImage: 'radial-gradient(circle, #004c67 0, #005771 120%)',
      zIndex: 1,
      marginBottom: '70px'
    },

    backgroundSmallHeader: {
      width: '100%',
      minHeight: '120px',
      backgroundColor: '#011c23',
      zIndex: 1,
      marginBottom: '40px'
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
      fontSize: '3em',
      marginTop: '4vh',
      marginBottom: '6vh'
    },

    pageTitleSmallSpan: {
      color: 'white',
      fontSize: '2em',
      marginTop: '3vh',
      marginBottom: '3vh'
    },

    searchLargeContainer: {
      height: '52px',
      width: '77%',
      paddingLeft: '23%',
      backgroundColor: 'white',
      boxShadow: 'grey 0px 1px 2px',
    },

    searchSmallContainer: {
    },

    searchIcon: {
      position: 'absolute',
      fontSize: '1.6em',
      marginTop: '7px',
      color: '#4f5b66',
      display: 'block',
    },

    searchLargeBar: {
      width: '50%',
      height: '50px',
      background: '#ffffff',
      border: 'none',
      fontSize: '12pt',
      float: 'left',
      color: '#63717f',
      paddingLeft: '40px',
    },

    searchSmallBar: {
      width: '100%',
      height: '50px',
      background: '#ffffff',
      border: 'none',
      fontSize: '11pt',
      float: 'left',
      color: '#63717f',
      paddingLeft: '65px',
      marginLeft: '-25px',
      borderRadius: '5px',
    },


    // Dropdown for selecting tmdb lists
    controls: {
      textAlign: 'left',
      paddingTop: '8px',
      width: '33.3333%',
      marginLeft: '0',
      marginRight: '0',
    },

    withData: {
      boxSizing: 'border-box',
      marginBottom: '0',
      display: 'block',
      padding: '0',
      verticalAlign: 'baseline',
      font: 'inherit',
      textAlign: 'left',
      boxSizing: 'border-box',
    },

    sortOptions: {
      border: '1px solid #000',
      maxWidth: '100%',
      overflow: 'hidden',
      lineHeight: 'normal',
      textAlign: 'left',
      padding: '4px 12px',
      paddingRight: '2rem',
      backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOCAxOCI+CiAgPHRpdGxlPmFycm93LWRvd24tbWljcm88L3RpdGxlPgogIDxwb2x5bGluZSBwb2ludHM9IjE0IDQuNjcgOSAxMy4zMyA0IDQuNjciIHN0eWxlPSJmaWxsOiBub25lO3N0cm9rZTogIzAwMDtzdHJva2UtbWl0ZXJsaW1pdDogMTA7c3Ryb2tlLXdpZHRoOiAycHgiLz4KPC9zdmc+Cg==")',
      backgroundSize: '18px 18px',
      backgroundPosition: 'right 8px center',
      backgroundRepeat: 'no-repeat',
      width: 'auto',
      display: 'inline-block',
      outline: 'none',
      boxSizing: 'border-box',
      fontSize: '15px',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
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
      color: 'black',
      fontSize: '1.6em',
      width: '20%',
    },

    resultSmallHeader: {
      paddingLeft: '12px',
      color: 'black',
      fontSize: '1.4em',
    },
}