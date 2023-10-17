import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Modal from 'react-modal'
import Navbar from './components/Navbar'

interface NewsArticle {
  source: {
    id: string | null
    name: string
  };
  url: string
  title: string
  publishedAt: string
  urlToImage: string
  content: string
}

const App = () => {
    const [newsData, setNewsData] = useState<NewsArticle[]>([])
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
    const API_KEY = '1c3a6745a75c4e92b0c1ffd7978d508c'
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<NewsArticle[]>([])
    const resultsPerPage = 10
    const ARTICLES_PER_PAGE = 20
    const MAX_ARTICLES = 100
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
    const languages = ['en', 'pl', 'it', 'ar', 'de', 'es', 'fr', 'he', 'nl', 'no', 'ru', 'sv', 'ud', 'zh']
    const [sortByPopularity, setSortByPopularity] = useState(false)
    const [dateFilter, setDateFilter] = useState<string>('')
    const [sourceFilter, setSourceFilter] = useState<string>('')
  
    const indexOfLastResult = currentPage * resultsPerPage
    const indexOfFirstResult = indexOfLastResult - resultsPerPage
    const currentResults = newsData.slice(indexOfFirstResult, indexOfLastResult)

    const filterArticles = (articles: NewsArticle[]) => {
        const filteredByDate = dateFilter
            ? articles.filter((article) => {
                const articleDate = new Date(article.publishedAt)
                const year = articleDate.getFullYear()
                const month = articleDate.getMonth() + 1
                const formattedDate = `${month}-${year}`
                return formattedDate === dateFilter
            })
            : articles

        const filteredBySource = sourceFilter
            ? filteredByDate.filter((article) => article.source.name.toLowerCase().includes(sourceFilter.toLowerCase()))
            : filteredByDate

        return filteredBySource
    }
    const filteredArticles = filterArticles(newsData)

    const transformDate = (dateString: string) => {
        const date = new Date(dateString)
        return date;
    }
    const formatMonthYearDate = (dateString: string) => {
        const transformedDate = transformDate(dateString)
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' }
        return transformedDate.toLocaleDateString(undefined, options)
    }
    const handleSearch = async () => {
        try {
            const response = await axios.get(
                `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}`
            )

            setSearchResults(response.data.articles);
        } catch (error) {
            console.error('Error searching for articles:', error)
        }
    }
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    }
    useEffect(() => {
      async function fetchHeadlinesForPage(pageNumber: number, languages: string[]) {
          try {
              const languageQueryString = languages.map(lang => `language=${lang}`).join('&')
              const response = await axios.get(
                  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&pageSize=${ARTICLES_PER_PAGE}&page=${pageNumber}&sortBy=popularity&${languageQueryString}`
              )

                  return response.data.articles

              } catch (error) {
                  console.error('Error downloading data:', error)
                  return []
              }
       }

      async function fetchAllHeadlines() {
          const allHeadlines = []
          let totalArticles = 0

          while (totalArticles < MAX_ARTICLES) {
              const articles = await fetchHeadlinesForPage(currentPage, selectedLanguages)

              if (articles.length === 0) {
                  break
              }

              allHeadlines.push(...articles)
              totalArticles += articles.length
              setCurrentPage((prevPage) => prevPage + 1)
          }

          setNewsData(allHeadlines)
          setLoading(false)
      }

      fetchAllHeadlines()
    }, [currentPage, selectedLanguages])

    const openModal = (article: NewsArticle) => {
      setSelectedArticle(article)
    }

    const closeModal = () => {
      setSelectedArticle(null)
    }

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLanguage = e.target.value
        const newLanguages = selectedLanguages.includes(selectedLanguage)
            ? selectedLanguages.filter((lang) => lang !== selectedLanguage)
            : [selectedLanguage]

        setSelectedLanguages(newLanguages)
        fetchArticles(newLanguages, sortByPopularity)
    }

    const handleSortByChange = () => {
        const newSortByPopularity = !sortByPopularity

        setSortByPopularity(newSortByPopularity)

        fetchArticles(selectedLanguages, newSortByPopularity)
    }

    const fetchArticles = async (languages: string[], sortByPopularity: boolean) => {
        try {
            let apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}&pageSize=${ARTICLES_PER_PAGE}`

            if (languages.length > 0) {
                apiUrl += `&language=${languages.join(',')}`
            }

            if (sortByPopularity) {
                apiUrl += '&sortBy=popularity'
            }

            const response = await axios.get(apiUrl)

            const articles = response.data.articles
            setNewsData(articles)
        } catch (error) {
            console.error('Error downloading data:', error)
        }
    };

  return (
      <div>
         <Navbar />
          <div>
              <h3>Filters</h3>
          <div
             style={{
                      border: '5px solid #ccc',
                      borderRadius: '5px',
                      padding:'8px',
                      width: 'fit-content'
             }}>
              <input
                  type="text"
                  style={{
                      marginRight: '10px',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      fontSize: '14px',
                      outline: 'none',
                  }}
                  placeholder="Filter by date (mm-yyyy)"
                  value={dateFilter}
                  onChange={(e) => {
                      const inputText = e.target.value;
                      if (/^\d*-*\d*$/.test(inputText) || inputText === '') {
                          setDateFilter(inputText);
                      }
                  }}
              />
              <input
                  type="text"
                  style={{
                      marginRight: '10px',
                      padding: '8px',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      fontSize: '14px',
                      outline: 'none',
                      marginLeft: '10px'
                  }}
                  placeholder="Filter by source"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
              />
                  <label style={{ marginRight: '10px', marginLeft: '10px' }}>
                  Select a language:
                  <select value={selectedLanguages[0]} onChange={handleLanguageChange}>
                      {languages.map((language) => (
                          <option key={language} value={language}>
                              {language}
                          </option>
                      ))}
                  </select>
              </label>
              <label>
                  Sort by Popularity:
                  <input
                      type="checkbox"
                      checked={sortByPopularity}
                      onChange={handleSortByChange}
                  />
                  </label>
              </div>
              {loading ? (
                  <p>Loading data...</p>
              ) : filteredArticles.length === 0 ? (
                  <p>No articles available</p>
              ) : (
                  <table>
                      {filteredArticles.map((article, index) => (
                          <tr key={index}>
                              <td>
                                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                                      {article.source.name}
                                  </a>
                              </td>
                              <td>{article.title}</td>
                              <td>{formatMonthYearDate(article.publishedAt)}</td>
                              <td>
                                  <button
                                      style={{
                                          backgroundColor: '#007BFF',
                                          color: '#fff',
                                          padding: '5px 10px',
                                          border: 'none',
                                          borderRadius: '4px',
                                          cursor: 'pointer'
                                      }}
                                      onClick={() => openModal(article)}>See more</button>
                              </td>
                          </tr>
                      ))}
                  </table>
              )}
             
          </div>
     
          <div style={{ display: 'inline-flex' }}>
         
      {loading ? (
        <p>Loading data...</p>
      ) : newsData.length === 0 ? (
        <p>No articles available</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Source Name</th>
              <th>Title</th>
              <th>Published At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {currentResults.map((article, index) => (
              <tr key={index}>
               <td>
        <a href={article.url} target="_blank" rel="noopener noreferrer">
          {article.source.name}
        </a>
      </td>
                <td>{article.title}</td>
                <td>{formatMonthYearDate(article.publishedAt)}</td>
                <td>
                  <button onClick={() => openModal(article)}>See more</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

          )}
          </div>
          <div className="pagination">
              {Array.from({ length: Math.ceil(newsData.length / resultsPerPage) }).map((_, index) => (
                  <button
                      key={index}
                      onClick={() => handlePageChange(index + 1)}
                      className={currentPage === index + 1 ? 'active' : ''}
                  >
                      {index + 1}
                  </button>
              ))}
          </div>
          <input
              type="text"
              style={{
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px',
                  outline: 'none',
              }}
              placeholder="Search articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                      handleSearch();
                  }
              }}
          />
          <button
              style={{
                  backgroundColor: '#007BFF',
                  color: '#fff', 
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px', 
                  cursor: 'pointer'
              }}
              onClick={handleSearch}>Search
          </button>
          {sortByPopularity ? (
              <div>
          <p>Sorted by popularity</p>
          <table>
              <thead>
                  <tr>
                      <th>Source Name</th>
                      <th>Title</th>
                      <th>Published At</th>
                      <th>Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {newsData.map((article, index) => (
                      <tr key={index}>
                          <td>
                              <a href={article.url} target="_blank" rel="noopener noreferrer">
                                  {article.source.name}
                              </a>
                          </td>
                          <td>{article.title}</td>
                          <td>{formatMonthYearDate(article.publishedAt)}</td>
                          <td>
                              <button onClick={() => openModal(article)}>See more</button>
                          </td>
                      </tr>
                  ))}
              </tbody>
                  </table>
          </div>
          ) : null}
          {searchResults.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                  {searchResults.length > 0 ? (
                      <div>
                          <h2>Search Results:</h2>
                          <ul>
                              {searchResults.map((result, index) => (
                                  <li key={index}>
                                      <a href={result.url} target="_blank" rel="noopener noreferrer">
                                          {result.title}
                                      </a>
                                  </li>
                              ))}
                          </ul>
                      </div>
                  ) : null}
              </div>
          ) : null}
      <Modal
          isOpen={selectedArticle !== null}
          style={{
              content: {
              borderRadius: '15px',
              maxWidth: '500px',
              maxHeight: '600px',
              margin: '0 auto',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
          }}
          onRequestClose={closeModal}
        >
          {selectedArticle && (
            <div style={{ padding: '20px', position: 'relative' }}>
              <button
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                }}
                onClick={closeModal}
              >
                X
              </button>
              <h2>{selectedArticle.title}</h2>
              <p>{selectedArticle.content}</p>
              <img
                src={selectedArticle.urlToImage}
                alt={selectedArticle.title}
                style={{
                  maxWidth: '250px',
                  maxHeight: '250px',
                }}
              />
            </div>
          )}
    </Modal>
    </div>
  )
}

export default App
