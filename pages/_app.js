import { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Router from 'next/router'

function collapseElement(elem) {
  if(elem === 'sidebar') document.getElementById(elem).classList.toggle('active')
  else {
    document.querySelectorAll('.parent-category-collapse').forEach((item) => {
      item.classList.remove('show')
    })
    document.getElementById(elem).classList.toggle('show')
  }
}

function App({ Component, pageProps }) {

  const [parentCategories, setParentCategories] = useState([])
  const [childCategories, setChildCategories] = useState([])

  const getCategories = async () => {
    const result = await fetch('/api/categories').then(result => result.json()).catch(err => err)
    setParentCategories(result?.data?.data.filter(item => (item.parent_id === 0) ? true : false ))
    setChildCategories(result?.data?.data.filter(item => (item.parent_id !== 0) ? true : false ))
  }

  const hasChild = (parentId) => {
    let hasChild = false
    childCategories.forEach(item => {
      if(!hasChild && item.parent_id === parentId) hasChild = true
    })
    return hasChild
  }

  useEffect( () => {
    console.log('_app.js')
    getCategories()
  }, [])

  return (
    <>
      <Head>
        <link rel="icon" href="/Logo.png" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <link rel="stylesheet" href="/frontend/css/theme.min.css" />
        <link rel="stylesheet" href="/frontend/css/style.css" />
        <link rel="stylesheet" href="/frontend/css/custom.css" />
      </Head>

      <div className="container-scroller">
        <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
          <div className="navbar-brand-wrapper d-flex justify-content-center">
            <div className="navbar-brand-inner-wrapper d-flex justify-content-between align-items-center w-100">  
              <a className="navbar-brand brand-logo" href="#">
                Ecommerce App
                {/* <img src="/frontend/images/logo.svg" alt="logo"/> */}
              </a>
              <a className="navbar-brand brand-logo-mini" href="#"><img src="/frontend/images/logo-mini.svg" alt="logo"/></a>
            </div>
          </div>
          <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
            <ul className="navbar-nav mr-lg-4 w-100">
              <li className="nav-item nav-search d-none d-lg-block w-100">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="search">
                      <i className="fa fa-search"></i>
                    </span>
                  </div>
                  <input type="search" className="form-control" placeholder="Search products from here ...." aria-label="search" aria-describedby="search" />
                </div>
              </li>
            </ul>
            <ul className="navbar-nav navbar-nav-right">
              <li className="nav-item dropdown mr-1">
                <a className="nav-link count-indicator dropdown-toggle d-flex justify-content-center align-items-center" id="messageDropdown" href="#" onClick={() => collapseElement('notification')}>
                  <i className="fa fa-sms"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right navbar-dropdown" id="notification">
                  <p className="mb-0 font-weight-normal float-left dropdown-header">Messages</p>
                  <a className="dropdown-item">
                    <div className="item-thumbnail">
                        <img src="/frontend/images/faces/face4.jpg" alt="image" className="profile-pic" />
                    </div>
                    <div className="item-content flex-grow">
                      <h6 className="ellipsis font-weight-normal">David Grey
                      </h6>
                      <p className="font-weight-light small-text text-muted mb-0">
                        The meeting is cancelled
                      </p>
                    </div>
                  </a>
                </div>
              </li>
              <li className="nav-item nav-profile dropdown">
                <a className="nav-link" href="#" onClick={() => collapseElement('profile')}>
                  <img src="/frontend/images/faces/face5.jpg" alt="profile" />
                  <span className="nav-profile-name">Louis Barnett</span>
                </a>
                <div className="dropdown-menu dropdown-menu-right navbar-dropdown" id="profile">
                  <a className="dropdown-item">
                    <i className="fa fa-sign-out-alt text-primary"></i>
                    Logout
                  </a>
                </div>
              </li>
            </ul>
            <button onClick={() => collapseElement('sidebar')} className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button">
              <span className="fa fa-list-ul"></span>
            </button>
          </div>
        </nav>
        <div className="container-fluid page-body-wrapper">
          <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">
              {
                parentCategories?.map(parent => (
                  <li key={parent.id} className="nav-item">
                    <a className="nav-link" onClick={() => {
                        collapseElement(`child${parent.id}`); Router.push(`?category=${parent.id}`)
                      }}>
                      <div style={{marginRight: '10px'}}>
                        { (parent?.banner_img?.file_name) &&
                          <Image className="preload-images" src={`https://khetkhamar.org/public/${parent?.banner_img?.file_name}`} alt="Category image" height={15} width={15} />
                        }
                        { !(parent?.banner_img?.file_name) &&
                          <Image className="preload-images" src={`/placeholder.jpg`} alt="Category image" height={15} width={15} />
                        }
                      </div>
                      <span className="menu-title">{ parent.name.substring(0, 7) } { (parent.name.length > 7) ? '..' : '' }</span>
                      { hasChild(parent.id) &&
                        <i className="fas fa-arrow-right cat-icon menu-icon"></i>
                      }
                    </a>
                    <div className="collapse parent-category-collapse" id={`child${parent.id}`}>
                      <ul className="nav flex-column sub-menu">
                        {
                          childCategories?.map(child => (
                            (child.parent_id == parent.id) &&
                              <li key={child.id} className="nav-item" onClick={() => Router.push(`?category=${child.id}`)}>
                                <a className="nav-link">{ child.name }</a>
                              </li>
                          ))
                        }
                      </ul>
                    </div>
                  </li>
                ))
              }
            </ul>
          </nav>
          
          <Component {...pageProps} />
          
          </div>
            <footer className="footer">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © Ecommerce App 2021</span>
              </div>
            </footer>
          </div>
    </>
  )
}

export default App