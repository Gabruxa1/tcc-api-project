import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'API Cliente',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const LoginScreen(),
    );
  }
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  final String baseUrl = 'http://192.168.1.4:433'; // Substitua com seu backend
  String? token;

  // Função para fazer login e guardar o JWT
  Future<void> login() async {
    final email = emailController.text;
    final senha = passwordController.text;

    final response = await http.post(
      Uri.parse('$baseUrl/connect/token'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({
        'email': email,
        'senha': senha,
      }),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        token = data['token'];
      });

      // Navegar para a tela de inserção após login bem-sucedido
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => MenuScreen(token: token)),
      );
    } else {
      // Exibir mensagem de erro se o login falhar
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            content: Text('Erro ao fazer login. Verifique suas credenciais.'),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Login'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            TextField(
              controller: emailController,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Senha'),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: login,
              child: const Text('Entrar'),
            ),
          ],
        ),
      ),
    );
  }
}

class MenuScreen extends StatefulWidget {
  final String? token;

  const MenuScreen({super.key, required this.token});

  @override
  _MenuScreenState createState() => _MenuScreenState();
}

class _MenuScreenState extends State<MenuScreen> {
  // Função para exibir o menu de navegação
  void navigateToInsert() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => InserirFuncionarioScreen(token: widget.token),
      ),
    );
  }

  void navigateToSearch() {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PesquisarFuncionarioScreen(token: widget.token),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Menu'),
      ),
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          ElevatedButton(
            onPressed: navigateToInsert,
            child: const Text('Inserir Funcionário'),
          ),
          ElevatedButton(
            onPressed: navigateToSearch,
            child: const Text('Pesquisar Funcionário'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Sair'),
          ),
        ],
      ),
    );
  }
}

class InserirFuncionarioScreen extends StatefulWidget {
  final String? token;

  const InserirFuncionarioScreen({super.key, required this.token});

  @override
  _InserirFuncionarioScreenState createState() =>
      _InserirFuncionarioScreenState();
}

class _InserirFuncionarioScreenState extends State<InserirFuncionarioScreen> {
  final nomeController = TextEditingController();
  final cpfController = TextEditingController();
  final telefoneController = TextEditingController();
  final emailController = TextEditingController();
  final senhaController = TextEditingController();
  final funcaoController = TextEditingController();
  final custoHoraController = TextEditingController();

  final String baseUrl = 'http://192.168.1.4:433';

  Future<void> inserirFuncionario() async {
    if (widget.token == null) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            content: Text('Você precisa estar logado para realizar esta ação.'),
          );
        },
      );
      return;
    }

    final funcionario = {
      'nome': nomeController.text,
      'cpf': cpfController.text,
      'telefone': telefoneController.text,
      'email': emailController.text,
      'senha': senhaController.text,
      'funcao': funcaoController.text,
      'admin': true,
      'ativo': true,
      'custo_hora': double.parse(custoHoraController.text),
    };

    final response = await http.post(
      Uri.parse('$baseUrl/funcionarios'),
      headers: {
        'Authorization': 'Bearer ${widget.token}',
        'Content-Type': 'application/json'
      },
      body: json.encode(funcionario),
    );

    if (response.statusCode == 200) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            content: Text('Funcionário inserido com sucesso!'),
          );
        },
      );
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            content: Text('Erro ao inserir funcionário'),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Inserir Funcionário'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            TextField(
                controller: nomeController,
                decoration: const InputDecoration(hintText: 'Nome')),
            TextField(
                controller: cpfController,
                decoration: const InputDecoration(hintText: 'CPF')),
            TextField(
                controller: telefoneController,
                decoration: const InputDecoration(hintText: 'Telefone')),
            TextField(
                controller: emailController,
                decoration: const InputDecoration(hintText: 'Email')),
            TextField(
                controller: senhaController,
                obscureText: true,
                decoration: const InputDecoration(hintText: 'Senha')),
            TextField(
                controller: funcaoController,
                decoration: const InputDecoration(hintText: 'Função')),
            TextField(
                controller: custoHoraController,
                decoration: const InputDecoration(hintText: 'Custo por hora')),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: inserirFuncionario,
              child: const Text('Inserir'),
            ),
          ],
        ),
      ),
    );
  }
}

class PesquisarFuncionarioScreen extends StatefulWidget {
  final String? token;

  const PesquisarFuncionarioScreen({super.key, required this.token});

  @override
  _PesquisarFuncionarioScreenState createState() =>
      _PesquisarFuncionarioScreenState();
}

class _PesquisarFuncionarioScreenState
    extends State<PesquisarFuncionarioScreen> {
  final idController = TextEditingController();

  final String baseUrl = 'http://192.168.1.4:433';

  Future<void> pesquisarFuncionario() async {
    if (widget.token == null) {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            content: Text('Você precisa estar logado para realizar esta ação.'),
          );
        },
      );
      return;
    }

    final response = await http.get(
      Uri.parse('$baseUrl/funcionarios/${idController.text}'),
      headers: {'Authorization': 'Bearer ${widget.token}'},
    );

    if (response.statusCode == 200) {
      final funcionario = json.decode(response.body);
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
            content: Text(json.encode(funcionario)),
          );
        },
      );
    } else {
      showDialog(
        context: context,
        builder: (BuildContext context) {
          return const AlertDialog(
            content: Text('Erro ao buscar funcionário'),
          );
        },
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pesquisar Funcionário'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: <Widget>[
            TextField(
                controller: idController,
                decoration:
                    const InputDecoration(hintText: 'ID do Funcionário')),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: pesquisarFuncionario,
              child: const Text('Pesquisar'),
            ),
          ],
        ),
      ),
    );
  }
}
