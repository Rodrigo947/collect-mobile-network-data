import { ScrollView, Text, View } from 'react-native';
import AppHeader from '../components/layout/AppHeader';
import ScreenContainer from '../components/layout/ScreenContainer';
import packageJson from '../package.json';
import usePrivacyStyleScreen from '../styles/privacyStyleScreen';

const appName = packageJson.name;

export default function PrivacyScreen() {
    const styles = usePrivacyStyleScreen();
    return (
        <ScreenContainer style={styles.container}>
            <AppHeader title="Política de Privacidade" showBackButton={true} />
            <ScrollView>
                <View style={styles.section}>
                    <Text style={styles.title}>1. Sobre este documento</Text>
                    <Text style={styles.text}>
                        Este documento descreve, de forma clara e transparente,
                        como o aplicativo {appName} ("Aplicativo", "App")
                        coleta, utiliza, armazena e protege os dados dos
                        usuários que optam por participar voluntariamente desta
                        pesquisa acadêmica.
                    </Text>
                    <Text style={styles.text}>
                        Ao aceitar estes termos, você declara que leu,
                        compreendeu e concorda com as condições aqui descritas.
                        Nenhuma coleta de dados é iniciada antes desse aceite
                        explícito. Você pode revogar seu consentimento e
                        interromper sua participação a qualquer momento,
                        conforme descrito na Seção 8.
                    </Text>
                    <Text style={styles.text}>
                        Este projeto é conduzido no âmbito do Programa de
                        Pós-Graduação em Ciência da Computação/UFJF, como parte
                        de um trabalho de pesquisa em mestrado na área de redes
                        móveis e inteligência artificial.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        2. Finalidade da coleta de dados
                    </Text>
                    <Text style={styles.text}>
                        O Aplicativo foi desenvolvido para fins exclusivamente
                        acadêmicos e de pesquisa científica. Seu objetivo é
                        construir um conjunto de dados (dataset) que permita
                        treinar modelos de inteligência artificial capazes de
                        caracterizar automaticamente o ambiente físico em que um
                        dispositivo móvel se encontra (por exemplo: área urbana
                        densa, região montanhosa, área de vegetação, proximidade
                        de corpos d'água, entre outros), a partir de métricas de
                        rede móvel.
                    </Text>
                    <Text style={styles.text}>
                        Essa caracterização tem aplicação em otimização de redes
                        móveis (4G/5G), auxiliando, por exemplo, na escolha de
                        algoritmos de handover (troca de célula) mais adequados
                        a cada tipo de ambiente.
                    </Text>
                    <Text style={styles.text}>
                        O Aplicativo não tem finalidade comercial, não exibe
                        anúncios, não vende dados e não os utiliza para qualquer
                        propósito além da pesquisa descrita.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        3. Quais dados são coletados
                    </Text>
                    <Text style={styles.text}>
                        Enquanto a coleta estiver ativada pelo usuário, o
                        Aplicativo registra periodicamente:
                    </Text>
                    <Text style={styles.subTitle}>3.1 Dados de rede móvel</Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Tecnologia de acesso (4G/LTE, 5G/NR)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Identificadores de célula servidora e células
                            vizinhas (Cell ID, PCI, TAC, ARFCN)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Identificadores de rede móvel (MCC/MNC — código do
                            país e da operadora, sem relação com sua identidade
                            pessoal)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Indicadores de qualidade de sinal: RSRP, RSRQ, RSSI,
                            SINR, Timing Advance
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Estado de registro na célula (servidora/vizinha)
                        </Text>
                    </View>

                    <Text style={styles.subTitle}>
                        3.2 Dados de localização
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Latitude e longitude
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Altitude e precisão da altitude
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Precisão da localização (accuracy)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Velocidade e direção de deslocamento (heading),
                            quando disponíveis
                        </Text>
                    </View>

                    <Text style={styles.subTitle}>
                        3.3 Dados de movimento (sensores inerciais)
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Acelerômetro (eixos X, Y, Z)
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Giroscópio (eixos X, Y, Z)
                        </Text>
                    </View>

                    <Text style={styles.subTitle}>
                        3.4 Dados do dispositivo
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>Modelo do aparelho</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Versão do sistema operacional Android
                        </Text>
                    </View>

                    <Text style={styles.subTitle}>3.5 Metadados</Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Data e hora (timestamp) de cada amostra coletada
                        </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>3.6 O que não é coletado</Text>
                    <Text style={styles.text}>
                        O Aplicativo não coleta, em nenhuma hipótese:
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Nome, e-mail, número de telefone ou qualquer
                            identificador pessoal direto;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Contatos, mensagens, fotos, áudios ou qualquer outro
                            conteúdo pessoal armazenado no dispositivo;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Dados de navegação, histórico de aplicativos
                            instalados ou de uso de outros apps;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Informações de pagamento ou financeiras.
                        </Text>
                    </View>
                    <Text style={styles.text}>
                        Reconhecemos que a localização é o dado com maior
                        potencial de identificação indireta do usuário (por
                        exemplo, ao revelar padrões de deslocamento como trajeto
                        para casa ou trabalho). Por isso, tratamos esse dado com
                        atenção especial, conforme descrito nas Seções 5 e 8.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        4. Como os dados são coletados
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            A coleta ocorre em segundo plano (background), em
                            intervalos periódicos, enquanto estiver
                            explicitamente ativada pelo usuário.
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            O usuário pode ativar ou desativar a coleta a
                            qualquer momento, diretamente no menu do Aplicativo.
                            Quando desativada, nenhum novo dado é registrado.
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Nenhuma coleta ocorre antes do consentimento inicial
                            (aceite destes Termos) nem durante períodos em que a
                            coleta esteja pausada pelo usuário.
                        </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        5. Anonimização e proteção dos dados
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Os dados são coletados sem qualquer identificador
                            pessoal direto (nome, e-mail, telefone, número de
                            série do aparelho vinculado ao usuário, etc.). O
                            dispositivo é associado apenas a um identificador
                            técnico anônimo gerado internamente pelo app, sem
                            vínculo com dados cadastrais.
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Mesmo sendo anonimizados, reconhecemos que dados de
                            localização coletados de forma contínua podem, em
                            tese, permitir inferências sobre padrões de
                            deslocamento. Por isso, o controle de
                            ativar/desativar a coleta e a exclusão de dados
                            (Seções 4 e 8) são disponibilizados de forma simples
                            e acessível a qualquer momento.
                        </Text>
                    </View>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        6. Acesso aos seus dados coletados
                    </Text>
                    <Text style={styles.text}>
                        Você tem o direito de consultar os dados que foram
                        coletados a partir do seu dispositivo. O Aplicativo
                        disponibiliza, em seu menu, uma opção para visualizar os
                        dados já enviados associados à sua participação.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        7. Uso e compartilhamento dos dados
                    </Text>
                    <Text style={styles.text}>
                        Os dados coletados (sempre de forma anonimizada e
                        agregada) serão utilizados para:
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Treinamento e avaliação de modelos de inteligência
                            artificial de caracterização ambiental;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Elaboração de artigos científicos, dissertações,
                            teses e apresentações acadêmicas;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Disponibilização do dataset anonimizado para outros
                            trabalhos acadêmicos e de pesquisa, inclusive de
                            terceiros, com finalidade científica (por exemplo,
                            publicação do dataset em repositórios acadêmicos
                            abertos ou compartilhamento com outros grupos de
                            pesquisa).
                        </Text>
                    </View>
                    <Text style={styles.text}>
                        Os dados não serão vendidos, utilizados para fins
                        comerciais ou publicitários, nem compartilhados com
                        terceiros para finalidades diferentes das descritas
                        neste documento.
                    </Text>
                    <Text style={styles.text}>
                        Caso o dataset (ou parte dele) seja publicado
                        publicamente para fins acadêmicos, isso será feito
                        apenas com os dados anonimizados, sem qualquer
                        identificador que permita associar os registros a um
                        usuário específico.
                    </Text>
                </View>
                <View style={styles.section}>
                    <Text style={styles.title}>
                        8. Seus direitos e controle sobre os dados
                    </Text>
                    <Text style={styles.text}>
                        Você pode, a qualquer momento, diretamente pelo menu do
                        Aplicativo:
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Pausar ou retomar a coleta de dados, sem perder seus
                            dados já enviados;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Consultar os dados já coletados vinculados ao seu
                            dispositivo;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Excluir permanentemente todos os seus dados
                            coletados e encerrar sua participação na pesquisa.
                            Essa exclusão é irreversível e remove seus registros
                            da base de dados da pesquisa;
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>{'\u2022'}</Text>
                        <Text style={styles.listText}>
                            Desinstalar o Aplicativo a qualquer momento, o que
                            interrompe imediatamente qualquer nova coleta.
                        </Text>
                    </View>
                    <Text style={styles.text}>
                        Esses direitos estão alinhados com a Lei Geral de
                        Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018),
                        que assegura ao titular dos dados, entre outros, os
                        direitos de acesso, exclusão e revogação do
                        consentimento.
                    </Text>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
}
