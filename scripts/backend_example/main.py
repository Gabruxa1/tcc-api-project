import requests
import getpass
import json

# URL base da API
BASE_URL = 'http://localhost:433'  # Ajuste conforme o seu backend

# Função para fazer login e guardar o JWT em memória
def login():
    email = input("Digite seu email: ")
    senha = getpass.getpass("Digite sua senha: ")
    
    login_data = {
        'email': email,
        'senha': senha
    }

    try:
        response = requests.post(f'{BASE_URL}/connect/token', json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            token = data['token']
            print("Login bem-sucedido!")
            return token
        else:
            print(f"Erro ao fazer login: {response.json()}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {e}")
        return None

# Função para realizar a inserção de um novo funcionário
def inserir_funcionario(token):
    if token is None:
        print("Você precisa estar logado para realizar esta ação.")
        return

    funcionario = {
        'nome': input("Nome: "),
        'cpf': input("CPF: "),
        'telefone': input("Telefone: "),
        'email': input("Email: "),
        'senha': getpass.getpass("Senha: "),
        'funcao': input("Função: "),
        'admin': input("Admin (true/false): ").lower() == 'true',
        'ativo': input("Ativo (true/false): ").lower() == 'true',
        'custo_hora': float(input("Custo por hora: "))
    }

    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.post(f'{BASE_URL}/funcionarios', json=funcionario, headers=headers)
        
        if response.status_code == 201:
            print("Funcionário inserido com sucesso!")
        else:
            print(f"Erro ao inserir funcionário: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {e}")

# Função para pesquisar funcionário por ID
def pesquisar_funcionario(token):
    if token is None:
        print("Você precisa estar logado para realizar esta ação.")
        return
    
    id_funcionario = input("Digite o ID do funcionário: ")
    headers = {'Authorization': f'Bearer {token}'}
    
    try:
        response = requests.get(f'{BASE_URL}/funcionarios/{id_funcionario}', headers=headers)
        
        if response.status_code == 200:
            funcionario = response.json()
            print(json.dumps(funcionario, indent=4))  # Exibe os dados formatados
        else:
            print(f"Erro ao buscar funcionário: {response.json()}")
    except requests.exceptions.RequestException as e:
        print(f"Erro de conexão: {e}")

# Função para exibir o menu de opções no terminal
def exibir_menu():
    print("\nEscolha uma opção:")
    print("1. Fazer login")
    print("2. Inserir funcionário")
    print("3. Buscar funcionário por ID")
    print("4. Sair")
    
def main():
    token = None
    while True:
        exibir_menu()
        escolha = input("Digite o número da opção desejada: ")
        
        if escolha == '1':
            token = login()
        elif escolha == '2':
            inserir_funcionario(token)
        elif escolha == '3':
            pesquisar_funcionario(token)
        elif escolha == '4':
            print("Saindo...")
            break
        else:
            print("Opção inválida, tente novamente.")

if __name__ == '__main__':
    main()
