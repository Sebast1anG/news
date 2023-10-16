const initialState = {
  newsData: [],
  selectedArticle: null,
  loading: true,
  filters: {
    source: null,
    year: null,
    month: null,
  },
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FILTER_BY_SOURCE':
      return {
        ...state,
        filters: { ...state.filters, source: action.source },
      };
    case 'FILTER_BY_DATE':
      return {
        ...state,
        filters: { ...state.filters, year: action.year, month: action.month },
      };
    case 'FETCH_DATA_REQUEST':
      return {
        ...state,
        loading: true,
      };
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        loading: false,
        newsData: action.data,
      };
    case 'FETCH_DATA_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
};

export default rootReducer;
