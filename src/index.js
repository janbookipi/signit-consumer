import { createRoot } from 'react-dom/client'

import React from 'react'

import 'src/assets/styles/common.scss'
import 'src/assets/styles/tailwind.css'

import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import './i18n'
import './yupExtensions'

import '@bookipi/bds/tailwind.css'
import 'animate.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'


const htmlTag = document.getElementsByTagName('html')[0]
htmlTag.setAttribute('data-theme', 'bookipi')

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<div>App</div>)
