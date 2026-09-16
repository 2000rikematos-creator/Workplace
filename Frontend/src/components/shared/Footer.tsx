import "./Footer.css"

function Footer(){
    const date = new Date().getFullYear()
return <div className="footer-container">
    <footer>
   <p>© workplace {date}</p> 
</footer>
</div> 
}

export default Footer