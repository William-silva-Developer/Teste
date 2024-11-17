

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Seção Sobre */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Sobre o WebCarros</h3>
          <p className="text-sm">
            O WebCarros é a sua plataforma confiável para comprar e vender veículos novos e usados em todo o Brasil.
          </p>
        </div>

        {/* Seção Links Rápidos */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Links Úteis</h3>
          <ul className="text-sm space-y-2">
            <li><a href="/sobre" className="hover:text-white">Sobre Nós</a></li>
            <li><a href="/contato" className="hover:text-white">Contato</a></li>
            <li><a href="/ajuda" className="hover:text-white">Ajuda e Suporte</a></li>
            <li><a href="/termos" className="hover:text-white">Termos de Uso</a></li>
            <li><a href="/privacidade" className="hover:text-white">Política de Privacidade</a></li>
          </ul>
        </div>

        {/* Seção Redes Sociais */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Siga-nos</h3>
          <div className="flex space-x-4">
            <a href="https://www.linkedin.com/in/william-desenvolvedor/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i ></i> Linkdin
            </a>
            <a href="https://github.com/William-silva-Developer" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              <i></i> GitHub
            </a>
            
          </div>
        </div>
      </div>

      {/* Seção de Copyright */}
      <div className="text-center mt-8 border-t border-gray-700 pt-4">
        <p className="text-sm">&copy; 2024 WebCarros. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export  {Footer};
