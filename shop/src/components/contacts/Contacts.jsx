import React from 'react'
import './Contacts.css'

export default function Contacts() {
  return (
    <div className="contacts-container">
      <div className="contacts-card">
        <h1>Контакты</h1>
        <p className="contacts-subtitle">Свяжитесь со мной любым удобным способом</p>
        
        <div className="contacts-list">
          <a 
            href="https://vk.com/kutuzova2005" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-item vk"
          >
            <div className="contact-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.579 6.855c.14-.465 0-.804-.662-.804h-2.193c-.558 0-.813.295-.953.619 0 0-1.115 2.719-2.695 4.482-.51.51-.743.673-1.021.673-.139 0-.34-.163-.34-.628V6.855c0-.558-.161-.804-.626-.804H9.642c-.348 0-.558.258-.558.505 0 .53.79.653.871 2.145v3.248c0 .71-.128.84-.407.84-.743 0-2.55-2.728-3.624-5.853-.209-.607-.42-.84-.98-.84H2.75c-.65 0-.78.295-.78.619 0 .58.743 3.457 3.457 7.267 1.812 2.601 4.363 4.011 6.687 4.011 1.393 0 1.565-.313 1.565-.852v-1.965c0-.651.138-.78.6-.78.34 0 .93.167 2.3 1.45 1.566 1.566 1.824 2.273 2.704 2.273h2.193c.65 0 .976-.313.788-.93-.205-.628-.942-1.543-1.92-2.626-.53-.627-1.324-1.303-1.565-1.643-.336-.419-.24-.604 0-.98 0 0 2.726-3.846 3.01-5.153z"/>
              </svg>
            </div>
            <div className="contact-info">
              <h3>ВКонтакте</h3>
              <p>@kutuzova2005</p>
            </div>
            <div className="contact-arrow">→</div>
          </a>
          
          <a 
            href="https://t.me/kkisaaaaaa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-item telegram"
          >
            <div className="contact-icon">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.665 3.717L2.895 10.308c-1.073.435-1.066 1.042-.197 1.313l4.224 1.316L16.79 6.855c.44-.268.842-.125.513.17l-8.414 7.59-.324 4.774c.466 0 .67-.21.922-.458l2.215-2.152 4.608 3.408c.848.467 1.457.227 1.668-.785l3.018-14.217c.31-1.24-.475-1.802-1.288-1.436z"/>
              </svg>
            </div>
            <div className="contact-info">
              <h3>Telegram</h3>
              <p>@kkisaaaaaa</p>
            </div>
            <div className="contact-arrow">→</div>
          </a>
        </div>
        
        <div className="contacts-note">
          <p>Буду рада ответить на ваши вопросы! </p>
        </div>
      </div>
    </div>
  )
}