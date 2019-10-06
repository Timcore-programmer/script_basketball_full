// версия 1.3 с автологином
// сделать счёт по каждой игре в каждом ТЗ свой

//***********************************************************************************************************************
// 1. Cекция глобальные переменные
//***********************************************************************************************************************

url_live = "http://1xpye.host/ru"
url_live += "/live/Basketball/"
login = "supersellerfamilia@yandex.ru"
pass = "aA00123456!8"  
path = "C:\\iMacros\\Macros\\1xbet\\" // Путь где лежит парсер и происходят все сохранения
file_output_error = "file_output_error"; // файл сохранения детальных сведений об ошибках для повторной проходки, добавлять при сохранении файла в конце .txt не забыть, .txt не вписан, так как имя может дополняться ключевой фразой
file_output1 = "file_outputT3_1"; // куда сохранять результаты работы, ТЗ1
file_output2 = "file_outputT3_2"; // куда сохранять результаты работы, ТЗ2
file_output3 = "file_outputT3_3"; // куда сохранять результаты работы, ТЗ3
file_output4 = "file_outputT3_4"; // куда сохранять результаты работы, ТЗ4
file_output5 = "file_outputT3_5"; // куда сохранять результаты работы, ТЗ5
file_win1 = "file_winT3_1"; // куда сохранять результаты работы, ТЗ1
file_win2 = "file_winT3_2"; // куда сохранять результаты работы, ТЗ2
file_win3 = "file_winT3_3"; // куда сохранять результаты работы, ТЗ3
file_win4 = "file_winT3_4"; // куда сохранять результаты работы, ТЗ4
file_win5 = "file_winT3_5"; // куда сохранять результаты работы, ТЗ5
file_temp = "temp"; // имя временного файла для сохранения результатов, при считывании добавлять расширение .htm так как команда записи SAVEAS пишет сразу с расширением
TZ4 = 1 // 1- включено ТЗ4, 0 - отключено
score_period2 = 20 // разница очков по второму ТЗ между тремя периодами
score_period3 = 6 // разница очков по третьему тз меньше либо равно
score_period41 = 0.8 // 20% разница между очками первых двух четвертей и Т1 и Т2
score_period42 = 10 // разница между первой и второй четвертью более 10 очков по default
score_period5 = 20 // разница между первой и второй четвертью более 20 очков по default
koef_how = 0.3 // разница коэффициента до 3 при поиске форы и тотала
koef_how2 = 0.3 // разница коэффициента до 1.9 при поиске результирующего тотала
pause_stake = 5 // пауза после ставки
time_refresh = 300
time_ok = 3
time_parse = 15 // время парсенья в секундах тотала 1.9 и 3
bet1 = 10 // ставка


//***********************************************************************************************************************
// 1. Конец секции глобальные переменные
//***********************************************************************************************************************


//***********************************************************************************************************************
// 2. Секция функции
//***********************************************************************************************************************

	//***********************************************************************************************************************
	// 2.0 Функция остановки скрипта клавишей STOP можно применять в любых роботах
// ОБРАТИТЬ ВНИМАНИЕ!!!
// (iimGetLastError()=="OK") - обратить внимание, теперь ошибка выполнения iMacros берётся только по ОК - т.е. выполнен был код без ошибок
// нельзя присваивать temp, проверяем так : (перед if идёт iimPlayCode) if (iimGetLastError()=="OK") // если вкладка Партия есть то ищем далее ставку 3:0

function iimPlayCode(code) {
    
    var Cc = Components.classes,
        Ci = Components.interfaces,
        wm = Cc["@mozilla.org/appshell/window-mediator;1"]
                .getService(Ci.nsIWindowMediator)
                .getMostRecentWindow("navigator:browser");

    iimPlay('CODE:' + code);

    if (iimGetLastError() == 'Macro stopped manually') {
            window.setTimeout(function() {
                wm.iMacros.panel.sidebar.
                document.getElementById('message-box-button-close').click()
            } , 4);
            throw 'Скрипт остановлен кнопкой стоп!';
    }
};

	// 2.0 конец Функции остановки скрипта клавишей STOP можно применять в любых роботах
	//***************************************

	//***********************************************************************************************************************
	// 2.1 Функция осхранения данных по средствам imacros

function save(data, filename)
{
iimSet("SAVE",data);iimPlayCode("ADD !EXTRACT {{SAVE}}\nSAVEAS TYPE=EXTRACT FOLDER=" + path + " FILE=" + filename)
}

	// 2.1 конец Функция осхранения данных по средствам imacros
	//***************************************
	
	//***************************************
	//***************************************
	//***************************************
	// Функция вывода тотала и форы кэффа

function get_koef(_part,stake_type) // функция парсенья матча по событию, _part= 0 (берём и 1.9 и 3.0); =1 при кэффе берём тоталы 1.9; =2 при кэфе 3 берём тоталы и фору
{

// открываем вторую вкладку
iimPlay("CODE:TAB OPEN")
Tabs.go(2)
iimPlay("CODE:URL GOTO="+url[section_now])
iimPlay("CODE:WAIT SECONDS = 3") // ждём загрузки основного окна, для ТОРА побольше

// открываем текущую четверть
macro = "CODE:"
macro += 'EVENT TYPE=CLICK SELECTOR="#dopEvsWrap_select_chosen>A>DIV>B" BUTTON=0' + '\n'
macro += 'EVENT TYPE=CLICK SELECTOR="#dopEvsWrap_select_chosen>DIV>UL>LI:nth-of-type(2)" BUTTON=0' + '\n'
iimPlay(macro)
iimPlay("CODE:WAIT SECONDS = 1") // ждём загрузки блока четверти текущего
// конец открытия текущей четверти, берём текущую четверть после Основное

dim = GetClass("bets betCols2") // берём весь результат

// Блок для коэффициента 1.9
if (_part == 1 || _part == 0)
{

_TOTAL = 0 // если данные не спарсили
_TOTAL_koef = 0

 _trigger = 0
 for (_i=0;_i<dim.length;_i++)
 {

	if (dim[_i].innerHTML.match(/span data-type="9"/) == 'span data-type="9"')
	{
		result = dim[_i].innerHTML.match(/\d{1,3}\.\d{1,3}/g) 
		
		for (_j=3;_j<result.length;_j+=6)// начинаем с 3-го элемента, это ТОТАЛЫ МЕНЬШЕ, кэфф элемент +1, перепрыгиваем +6 чтобы опять убрать ТОТАЛЫ больше
		{
			if (Math.abs(result[_j+1]-1.9) <= koef_how2)
			{
			temp_total = result[_j] + "М"
			temp_total_koef = result[_j+1]
			_trigger = 1
			break // выходим из цикла
			}
		}

	break
	}
 }

_TOTAL = result[_j] // _TOTAL усреднёный _TOTAL для всех матчей с 1.9
_TOTAL_koef = result[_j+1] // Коэффициент усреднёного тотала
} // конец _part == 1 или == 0

// Блок для коэффициента 3
if (_part == 2 || _part == 0)
{

// блок считывания ТОТАЛА и ФОРЫ
temp_total = 0
temp_total_koef = 0
temp_fora = 0
temp_fora_koef = 0
 _trigger = 0
 // БЛОК ТОТАЛА
 for (_i=0;_i<dim.length;_i++)
 {
 	if (dim[_i].innerHTML.match(/span data-type="9"/) == 'span data-type="9"')
	{
		result = dim[_i].innerHTML.match(/\d{1,3}\.\d{1,3}/g) 
		
		for (_j=3;_j<result.length;_j+=6)// начинаем с 3-го элемента, это ТОТАЛЫ МЕНЬШЕ, кэфф элемент +1, перепрыгиваем +6 чтобы опять убрать ТОТАЛЫ больше
		{

			if (Math.abs(result[_j+1]-3) <= koef_how )
			{
			temp_total = result[_j] + "М"
			temp_total_koef = result[_j+1]
			_trigger = 1

				if (stake_type == 1) // если 1 то тоталы, 2 то форы
				{
				get_one_click()
				get_stake(bet1)
				
					// подблок поиска события для ставки
					bet = GetClass("bet_type")
					for (l=0;l<bet.length;l++)
					{
						if (bet[l].textContent.match(/\d{2}\.5 М/) == (result[_j] + " М")) // сравнение найденного тотала
						{
						bet[l].focus()
						bet[l].click()
						}
					}
				
				iimPlayCode("WAIT SECONDS = " + pause_stake)
				iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")
				}
				
			break // выходим из цикла
			}

		}
	break
	}
 }

 // БЛОК ФОРЫ
	for (_i=0;_i<dim.length;_i++)
	{
		if (dim[_i].innerHTML.match(/span data-type="7"/) == 'span data-type="7"') // берём ФОРУ данные 7-я секция
		{
		result = dim[_i].innerHTML.match(/\d{1,3}\.\d{1,3}/g) 
			for (_j=0;_j<result.length;_j+=3) // рассматриваем ФОРУ, все элементы
			{
				if (Math.abs(result[_j+1]-3) <= koef_how )
				{
				temp_fora = result[_j]
				temp_fora_koef = result[_j+1]
				
					if (stake_type == 2) // если 1 то тоталы, 2 то форы
					{
					get_one_click()
					get_stake(bet1)
					
					// подблок поиска события для ставки
					bet = GetClass("bet_type")
					for (l=0;l<bet.length;l++)
					{
						if (bet[l].textContent.match(/1 .\d{1,2}\.5/) == ("1 -" + result[_j]) || bet[l].textContent.match(/1 .\d{1,2}\.5/) == ("1 " + result[_j]) || bet[l].textContent.match(/2 .\d{1,2}\.5/) == ("2 -" + result[_j]) || bet[l].textContent.match(/2 .\d{1,2}\.5/) == ("2 " + result[_j])) // сравнение найденного тотала
						{
						bet[l].focus()
						bet[l].click()
						}
					}

					iimPlayCode("WAIT SECONDS = " + pause_stake)
					iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")
					}
				
				break // выходим из цикла	
				}
			}
		break
		}
	}

	// присваиваем текущее значение для тоталов для кэффа 3 +- koef_how
	if (total[section_now] == 0 || total[section_now] == undefined || total[section_now] == null)
	{
	total[section_now] = temp_total; 
	}

	if (total_koef[section_now] == 0 || total_koef[section_now] == undefined || total_koef[section_now] == null)
	{
	total_koef[section_now] = temp_total_koef
	}

	// присваиваем текущее значение для форы для кэффа 3 +- koef_how
	if (fora[section_now] == 0 || fora[section_now] == undefined || fora[section_now] == null)
	{
	fora[section_now] = temp_fora
	}

	if (fora_koef[section_now] == 0 || fora_koef[section_now] == undefined || fora_koef[section_now] == null)
	{
	fora_koef[section_now] = temp_fora_koef
	}

} // конец _part == 2 или == 0

//-------------------------------------------------------------------------------
// 3.1 вариант
if (_part == 3.1) // вариант когда выделяем фору первого
{
	// БЛОК ФОРЫ
	for (_i=0;_i<dim.length;_i++)
	{
		
		if (dim[_i].innerHTML.match(/span data-type="7"/) == 'span data-type="7"') // берём ФОРУ данные 7-я секция
		{
		result = dim[_i].innerHTML.match(/\+\d{1,3}\.\d{1,3}|\-\d{1,3}\.\d{1,3}|\d{1,3}\.\d{1,3}/g) // берём форы с +, -, и простые
		
			for (_j=0;_j<result.length;_j+=3) // рассматриваем ФОРУ, все элементы
			{
				if (Math.abs(result[_j+1]-3) <= koef_how )
				{
				save(result[_j],file_temp)
				temp_fora = result[_j]
				temp_fora_koef = result[_j+1]
				
					if (stake_type == 2) // если 1 то тоталы, 2 то форы
					{
					get_one_click()
					get_stake(bet1)
					// подблок поиска события для ставки
						bet = GetClass("bet_type")
						for (l=0;l<bet.length;l++)
						{
						
							if (result[_j].match(/\+/) == true) // знак форы
							{
							_sign = "+"
							}
							else if (result[_j].match(/\-/) == true)
							{
							_sign = "-"
							}
							else
							{
							_sign = " "
							}
							_fora_result = result[_j].match(/\d{1,3}\.\d{1,3}/) // числовое значение форы
						
							if (bet[l].textContent.match(/1 .\d{1,2}\.5/) == ("1 " + _sign + _fora_result)) // сравнение найденной форы, для первой команды с минусом
							{
							bet[l].focus()
							bet[l].click()
							break 
							}
						}
					iimPlayCode("WAIT SECONDS = " + pause_stake)
					iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")
					}
				
				break // выходим из цикла, по первой команде	
				}
			}
		break
		}
	}
} // конец 3.1
//-------------------------------------------------------------------------------
// 3.2 вариант
if (_part == 3.2) // вариант когда выделяем фору первого
{
	// БЛОК ФОРЫ
	for (_i=0;_i<dim.length;_i++)
	{

		if (dim[_i].innerHTML.match(/span data-type="7"/) == 'span data-type="7"') // берём ФОРУ данные 7-я секция
		{
		result = dim[_i].innerHTML.match(/\+\d{1,3}\.\d{1,3}|\-\d{1,3}\.\d{1,3}|\d{1,3}\.\d{1,3}/g) // берём форы с +, -, и простые 
		_trigger = 0
			
			for (_j=0;_j<result.length;_j+=3) // рассматриваем ФОРУ, все элементы
			{
				if (Math.abs(result[_j+1]-3) <= koef_how )
				{
				temp_fora = result[_j]
				save(result[_j],file_temp)
				temp_fora_koef = result[_j+1]
				_trigger++
	
					if (_trigger==2) // выход по второй команде
					{
					
						if (stake_type == 2) // если 1 то тоталы, 2 то форы
						{
						get_one_click()
						get_stake(bet1)
					
							// подблок поиска события для ставки
							bet = GetClass("bet_type")
							for (l=0;l<bet.length;l++)
							{
								if (result[_j].match(/\+/) == "+") // знак форы
								{
								_sign = "+"
								}
								else if (result[_j].match(/\-/) == "-")
								{
								_sign = "-"
								}
								else
								{
								_sign = " "
								}
								_fora_result = result[_j].match(/\d{1,3}\.\d{1,3}/) // числовое значение форы
						
								if (bet[l].textContent.match(/2 .\d{1,2}\.5/) == ("2 " + _sign + _fora_result)) // сравнение найденной форы, для первой команды с минусом
								{
								bet[l].focus()
								bet[l].click()
								break 
								}
							}
						
						iimPlayCode("WAIT SECONDS = " + pause_stake)
						iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")
						}
					
					break // выходим из цикла	
					}
				}
			}
		break
		}

	}
} // конец 3.2
//-------------------------------------------------------------------------------


iimPlay("CODE:TAB CLOSE")
Tabs.go(1) // выходим
}

	// Функция вывода тотала и форы кэффа
	//***************************************
	//***************************************
	//***************************************


	//***************************************
	// 2.2 Функция загрузки картинок 0 - отключено picture_load(0), 1 - включено icture_load(1)

function picture_load(selector)
{
prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch); // about:config
	if (selector == 0)
	 {
	 prefs.setIntPref("permissions.default.image", 2) // отключаем загрузку картинок
	 }
	else
	 {
	 prefs.setIntPref("permissions.default.image", 1) // включаем загрузку картинок
	 }
}
	
	// 2.2 конец Функции загрузки картинок
	//***************************************


	//***************************************
	// 2.3 Функция загрузки файла
loadFile = function (fileName) // Доработанная функция чтения файла с убиранием лишнего \r от винды текстовых файлов
{
	var fileDescriptor = imns.FIO.openNode(path+fileName);
	wow = imns.FIO.readTextFile(fileDescriptor);
	wow = wow.replace(/\r\n/g,"\n"); //чистка от мусорного кода
	wow = wow.replace(/ /g,"<SP>"); // чистка от пробелов
	return (wow)
}

function loadFile_simple(fileName) {
	fileDescriptor = imns.FIO.openNode(fileName);
	return imns.FIO.readTextFile(fileDescriptor);
}
	// 2.3 Функция загрузки файла
	//***************************************

	// 2.6 перезагрузка страницы, если надо
	//***************************************

function refresh(n) // параметр 0 - только открытие вкладки купоны, 1 - перегрузка страницы + открытие вкладки купоны
{	
		if (n==1)
		{		iimPlayCode("URL GOTO=" + url_live)
		// Блок проверки открытого окна купонов, иначе будут ошибки, если закрыто скрипт откроет
		}
}
	// 2.6 конец функции перезагрузки страницы
	//***************************************
	
	//***************************************
	// 2.7 функция хождения по TAB вкладкам по номеру, вызов Tabs.go(номер вкладки от 1 и далее, 1 первая левая)

var Tabs = {
	_browser: function () {			
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"] 
			 .getService(Components.interfaces.nsIWindowMediator);		
		return wm.getMostRecentWindow("navigator:browser").gBrowser;
	}(),

	go: function (tabIndex) {
		this._browser.selectedTab = this._browser.tabContainer.childNodes[tabIndex - 1];	
	}
};

	// 2.7 функция хождения по TAB вкладкам по номеру, вызов Tabs.go(номер вкладки от 1 и далее, 1 первая левая)
	//***************************************

function GetClass(s) {return content.document.getElementsByClassName(s) } // удобно брать по классу переменную на будущее надо везде использовать

function GetId(s) {return content.document.getElementById(s) } // удобно брать по классу переменную на будущее надо везде использовать

function get_date() // функция получения даты
{
Data = new Date();
Year = Data.getFullYear();
Month = Data.getMonth();
Day = Data.getDate();
 
// Преобразуем месяца
switch (Month)
{
  case 0: fMonth="января"; break;
  case 1: fMonth="февраля"; break;
  case 2: fMonth="марта"; break;
  case 3: fMonth="апреля"; break;
  case 4: fMonth="мая"; break;
  case 5: fMonth="июня"; break;
  case 6: fMonth="июля"; break;
  case 7: fMonth="августа"; break;
  case 8: fMonth="сентября"; break;
  case 9: fMonth="октября"; break;
  case 10: fMonth="ноября"; break;
  case 11: fMonth="декабря"; break;
}

Hour = Data.getHours();
Minutes = Data.getMinutes();
Seconds = Data.getSeconds();

date = Day+" "+fMonth+" "+Year+" года; " +Hour+":"+Minutes+":"+Seconds
if (Seconds < 10) {date = Day+" "+fMonth+" "+Year+" года; " +Hour+":"+Minutes+":"+ "0" + Seconds} // уточнение по секундам формат 07 вместо 7

return(date)
}

function get_time() // берём текущее время матча, минуты, секунды
{
temp_time = time[i].textContent.match(/\d+\:\d+/)

	if (temp_time == null) // данные не спарсены
	{
	time_minutes = 0 // считаем что матч не начался
	time_seconds = 0
	return
	}

_temp_time = temp_time[0].match(/\d+/g)
time_minutes = _temp_time[0]
time_seconds = _temp_time[1]
}

// ставим нажатие в один клик
function get_one_click()
{
iimPlay("CODE:TAG POS=1 TYPE=LABEL ATTR=TXT:В<SP>1<SP>клик:")
iimPlay("CODE:TAG POS=1 TYPE=INPUT:CHECKBOX ATTR=ID:one-click CONTENT=YES")
}

function get_stake(_stake) // ввод ставки
{
//_stake=10
iimPlay("CODE:TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:one-click-sum CONTENT=" + _stake)
iimPlay("CODE:TAG POS=1 TYPE=SPAN ATTR=CLASS:coupon__input-btn<SP>coupon__input-btn_confirm<SP>js-one-confirm<SP>fa-check&&TXT:")
iimPlay("CODE:TAG POS=1 TYPE=BUTTON ATTR=TXT:ОК")
}

function get_login(count) // счётчик логина по счёту
{
macro = "CODE:"
macro += "SET !ERRORIGNORE YES" + "\n"
macro += "SET !TIMEOUT_TAG 1" + "\n"
macro += "TAG POS=1 TYPE=SPAN ATTR=TXT:Войти" + "\n"
macro += 'WAIT SECONDS = 2' + '\n'
macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:fLogin2 ATTR=ID:userLogin CONTENT=" + login + "\n"
macro += "SET !ENCRYPTION NO" + "\n"
macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:fLogin2 ATTR=ID:userPassword CONTENT=" + pass+ "\n"
//macro += "TAG POS=1 TYPE=LABEL FORM=ID:fLogin2 ATTR=TXT:Запомнить" + "\n"
//macro += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:fLogin2 ATTR=ID:chSaveMe CONTENT=YES" + "\n"
macro += 'WAIT SECONDS = 1' + '\n'
macro += "TAG POS=1 TYPE=A ATTR=ID:userConButton" + "\n"
macro += 'WAIT SECONDS = 2' + '\n'
// подтверждаем слово контрольное, отключено
//macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:NoFormName ATTR=ID:answer CONTENT=" + word[count] + "\n"
//macro += "TAG POS=1 TYPE=BUTTON FORM=NAME:NoFormName ATTR=TXT:Подтвердить" + "\n"
macro += 'WAIT SECONDS = 2' + '\n'
iimPlay(macro)
}



//***********************************************************************************************************************
// Секция назначения переменных
//***********************************************************************************************************************

var section_now;
total = [] // тоталы для 3 кэффа
total_koef = [] // кэфф для тотала 3
fora = [] // фора для 3 кэффа
fora_koef = [] // кэфф для форы 3
_temp_koef = [] // четыре секции куда идёт возврат тоталов и фор
time_minutes = 0 // минуты текущего периода
time_seconds = 0 // секунды текущего периода
_TOTAL = 0	// тотал для 1.9
_TOTAL_koef = 0 // коэффициент тотала для 1.9
T1 = 0 // усреднёный тотал всех четвертей до текущей, берётся из get_koef(1) из переменной _TOTAL
time_start = 0 // начальный таймер события
time_ok = 0 // таймер нажатия на ОК после сделания ставки изначально 5 секунд проверка
time_work = 0 // время работы программы если включена переменная timer ограничивающая работу
P1 = [] // коэффициент на победу первого в первой четверти
P2 = [] // коэффициент на победу второго в первой четверти
elems = [] // список коэффициентов по матчу
url = [] // ссылки на матч
first1 = [] // результаты 1-й четверти первого
first2 = [] // результаты 1-й четверти второго
second1 = [] // результаты 2-й четверти первого
second2 = [] // результаты 2-й четверти второго
third1 = [] // результаты 3-й четверти первого
third2 = [] // результаты 3-й четверти второго
favorite1 = [] // фаворит ТЗ №1
favorite2 = [] // фаворит ТЗ №2
favorite3 = [] // фаворит ТЗ №3
favorite4 = [] // фаворит ТЗ №4
use1 = [] // было ли событие на матч ТЗ №1
use2 = [] // было ли событие на матч ТЗ №2
use3 = [] // было ли событие на матч ТЗ №3
use4 = [] // было ли событие на матч ТЗ №4
use5 = [] // было ли событие на матч ТЗ №5
time_start = 0 // цикл смены страниц
//***********************************************************************************************************************
// Конец Секции назначения переменных
//***********************************************************************************************************************

//***********************************************************************************************************************
// Секция BODY
//***********************************************************************************************************************

//iimPlayCode("CLEAR");
picture_load(0)
// window.onerror=null; // отключаем ошибки javascript обратить внимание
iimPlayCode ("TAB CLOSEALLOTHERS")
iimPlayCode ("URL GOTO=" + url_live)

get_login()
iimPlayCode ("TAB CLOSEALLOTHERS")
iimPlayCode ("URL GOTO=" + url_live)
get_one_click()
get_stake(bet1)

// бесконечный цикл
while (1)
{


//________________________________________________________________
// подблок перезагрузки страницы по таймингу
time_start++
if (time_start >= time_refresh)
{
	time_start = 0
	iimPlayCode ("TAB CLOSEALLOTHERS")
	iimPlayCode ("URL GOTO=" + url_live)
}
//________________________________________________________________


try
{

iimPlayCode("WAIT SECONDS = 1")

//************************************************************************
// берём текущий глобальный DOM в области интересующих нас данных, для анализа
period = GetClass ("c-events__overtime") // название периодов
names = GetClass("c-events__item c-events__item_col") // имена конкретных матчей
score = GetClass("c-events__score") // счёт по матчам
bets = GetClass("c-bets") // коэффициенты команд
time = GetClass("c-events__time") // время матча

//************************************************************************
// Подблок считывания коэффициентов по всей странице

	delete elems // удаляем все элекменты массива ранее сделанного, мло ли какие нововведения
	var elems = [] // заново объявляем массив

	temp_count = 0
	for (j=0;j<bets.length;j++)
	{
	elems1 = bets[j].textContent.match(/-\d{1,3}\.5|\d{1,2}\.\d{1,3}|-|\d{2,3}/g)

		if (elems1 != null && elems1.length > 15) // если это заголовок, а не коэффициенты
		{
			data = ""
			for (k=0;k<15;k++)
			{
				data += elems1[k] + ";" 
			}
			elems[temp_count] = data
			temp_count++
		}
	}
//*****************************************************************************************
// Конец подблока считывания коэффициентов, в переменной elems[i] - будут лежать результаты

//*****************************************************************************************
//*****************************************************************************************
//Основной блок хождения по матчам

	for (i=0;i<names.length;i++) // количество четвертей по играм, совпадает с количеством игр
	{
		// проверяем начался ли матч, если нет идём на следующее событие
		if (period[i] == undefined || period[i] == null)
		{
			continue // идём на другое событие
		}

	get_time() // берём время текущего события
	st1 = names[i].innerHTML.match(/href="live\/Basketball\/(.+?)"/) // берём всё подряд из href ссылка
	st2 = st1[0].replace(/,(.+?)/,"") // удаляем всё после запятой, остаётся только ссылка + href="
	st2 = st2.replace(/"/,"") // удаляем ковычки
	st2 = st2.replace(/"/,"") // удаляем ковычки
	st2 = st2.replace(/href=live\/Basketball\//,"")
	temp1 = st2.match(/\d{6}/)  // вычленяем номер лиги
	temp2 = st2.match(/\d{9}/)  // вычленяем номер матча
	section_now = temp1 + temp2
		
		if (url[section_now] == undefined || url[section_now] == null)
		{
			
			url[section_now] = url_live + st2 // назначаем ссылку на матч
		}

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Начало первого ТЗ проверяем вторую четверть

// назначаем P1 и P2 если идёт первый период и матч ещё не парсился
		
		if (period[i].textContent.match(/2 чет/) == "2 чет" && time_minutes == 10 && time_seconds <= time_parse)
		{

			if (P1[section_now] == undefined || P1[section_now] == null) // если ещё не спарсены коэффициенты
			{
				temp_elems = elems[i].match(/-\d{1,3}\.5|\d{1,2}\.\d{1,3}|-|\d{2,3}/g)
					// проверяем адекватно ли взяли данные, нет ли прочерка была ли роспись
					if (temp_elems[0] != "-") // только если коэффициент получен назначаем, иначе нет
					{
						P1[section_now] = temp_elems[0] // коэффициент на победу первого
						P2[section_now] = temp_elems[2] // коэффициент на победу второго
//						data = "Фиксируем коэффициенты 2-я четверть ID: " + section_now + " " + get_date() + " Коэффициенты П1,П2: " + P1[section_now] + " ; " + P2[section_now]  + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
//						save(data,file_output1)
					}
				
				if (P1[section_now] > P2[section_now])
				{
					favorite1[section_now] = 2
				}
				else if (P1[section_now] <= P2[section_now])
				{
					favorite1[section_now] = 1
				}
			}
		}

// берём тоталы очков по первому периоду
		
		if (period[i].textContent.match(/2 чет/) == "2 чет" && first1[section_now] == undefined && time_minutes == 10 && time_seconds <= time_parse) 
		{
			get_koef(1) // берём тоталы на 1.9 и 3.0
			temp_score = score[i].textContent.match(/\d{1,2}/g)
			first1[section_now] = temp_score[0]
			first2[section_now] = temp_score[1]
//			data = "-отладка 2ч- ID: " + section_now + " " + get_date() + " Счёт 1ч " + first1[section_now] + ":" + first2[section_now] + " Коэффициенты П1,П2: " + P1[section_now] + " ; " + P2[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
//			save(data,file_output1)
		
			if (favorite1[section_now] == 1)
			{
			temp_koef = P2[section_now]/P1[section_now]
			}
			else if(favorite1[section_now] == 2)
			{
			temp_koef = P1[section_now]/P2[section_now]
			}
			else {temp_koef = null} // нет коэффициентов P1 и P2 не следим за матчем
// событие совпало
			total_score11 = +first1[section_now] + +first2[section_now]
			T1 = _TOTAL
	 		
			_trigger = 0
			if (temp_koef <= 3 && temp_koef != null) 
			{
				if (Math.abs(first1[section_now] - first2[section_now]) <= 3)
				{
			
					if (total_score11 >= 1.3*T1)
					{
					_trigger = 1 // положительное событие
					get_koef(2,1) // ставим на 3.0 тоталы
					data = "Событие ID: " + section_now + " " + get_date() + " Счёт 1ч " + first1[section_now] + ":" + first2[section_now] + " Коэффициенты П1,П2: " + P1[section_now] + " ; " + P2[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] + " П1/П2= " + temp_koef + " Разница Тотала 1-й четверти и 2-й за 1.9 " + Math.abs(total_score11 - T1) + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output1)
					save(data,file_win1)
					}		
				}
			}
		
			if (_trigger == 0) // что-то не совпало
			{
			data = "Нет события ID: " + section_now + " " + get_date() + " Счёт 1ч " + first1[section_now] + ":" + first2[section_now] + " Коэффициенты П1,П2: " + P1[section_now] + " ; " + P2[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] + " П1/П2= " + temp_koef + " Разница Тотала 1-й четверти и 2-й за 1.9 " + Math.abs(total_score11 - T1) + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
			save(data,file_output1)
			}
		}

// Конец первого ТЗ 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Начало второго ТЗ 

		if (period[i].textContent.match(/4 чет/) == "4 чет" && use2[section_now] == undefined && time_minutes == 30 && time_seconds <= time_parse) 
		{
			temp_score = score[i].textContent.match(/\d{1,2}/g)
			first1[section_now] = temp_score[0]
			first2[section_now] = temp_score[1]
			second1[section_now] = temp_score[2]
			second2[section_now] = temp_score[3]
			third1[section_now] = temp_score[4]
			third2[section_now] = temp_score[5]
			use2[section_now] = 1 // событие зафиксировано
			total_score13 = +first1[section_now] + +second1[section_now] + +third1[section_now] // 13 индекс 1 - первый, 3 - три четверти прошлых складываем
			total_score23 = +first2[section_now] + +second2[section_now] + +third2[section_now] // 23 индекс 2 - второй, 3 - три четверти прошлых складываем
			sub2 = total_score13 - total_score23
			
			_trigger = 0	
			if (first1[section_now] > first2[section_now] && second1[section_now] > second2[section_now] && third1[section_now] > third2[section_now])
			{
				if (sub2 > score_period2) // score_period2
				{
					_trigger = 1
					favorite2[section_now] = 1
					get_koef(3.2,2) // ФОРА на вторую команду, при кэффе 3.0
//					get_koef(2,1) // ставим на 3.0 тоталы
					data = "Событие ID: " + section_now + " " + get_date() + " Идёт четвёртая четверть, Счёт 3-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "][" + third1[section_now] + ":" + third2[section_now] + "] Разница очков: " + sub2 + " Фаворит: " + favorite2[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] + " Фора (" + fora[section_now] + ") ФораК= " + fora_koef[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output2)
					save(data,file_win2)
				}
			}

			if (first1[section_now] < first2[section_now] && second1[section_now] < second2[section_now] && third1[section_now] < third2[section_now])
			{
				if ((0-sub2) > score_period2 && sub2 < 0) // score_period2 - разница очков по между первым и вторым игроком по 3-м четвертям
				{
					_trigger = 1
					favorite2[section_now] = 2
					get_koef(3.1,2) // ФОРА на первую команду, при кэффе 3.0
//					get_koef(2,1) // ставим на 3.0 тоталы
					data = "Событие ID: " + section_now + " " + get_date() + " Идёт четвёртая четверть, Счёт 3-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "][" + third1[section_now] + ":" + third2[section_now] + "] Разница очков: " + sub2 + " Фаворит: " + favorite2[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] + " Фора (" + fora[section_now] + ") ФораК= " + fora_koef[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output2)
					save(data,file_win2)
				}
			}	
				
			if (_trigger == 0)
			{
			data = "Нет события ID: " + section_now + " " + get_date() + " Идёт четвёртая четверть, Счёт 3-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "][" + third1[section_now] + ":" + third2[section_now] + "] Разница очков: " + sub2 + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
			save(data,file_output2)
			}

		} // конец второго ТЗ

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Конец второго ТЗ 


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Начало третьего ТЗ 

		if (period[i].textContent.match(/3 чет/) == "3 чет" && use3[section_now] == undefined && time_minutes == 20 && time_seconds <= time_parse) 
		{
			temp_score = score[i].textContent.match(/\d{1,2}/g)
			first1[section_now] = temp_score[0]
			first2[section_now] = temp_score[1]
			second1[section_now] = temp_score[2]
			second2[section_now] = temp_score[3]
			use3[section_now] = 1 // матч уже был
			total_score12 = +first1[section_now] + +second1[section_now] // Т4 - 12 индекс 1 - первый, 2 - две четверти прошлых складываем
			total_score22 = +first2[section_now] + +second2[section_now] // Т5 - 22 индекс 2 - второй, 2 - две четверти прошлых складываем
			_total_T1 = +first1[section_now] + +second1[section_now]
			_total_T2 = +first2[section_now] + +second2[section_now]
			
			sub3 = total_score12 - total_score22
			get_koef(1)
			T1 = _TOTAL
			// Разница очков между первой и второй командой не более score_period3 - по default 6

				_trigger = 0
				if (Math.abs(sub3) <= score_period3) 
				{
					if (_total_T1 >= T1 && _total_T2 >= T1)
					{
					_trigger = 1
					get_koef(2,1) // ставим на 3.0 тоталы
					data = "Событие ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков: " + sub3 + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] +  " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output3)
					save(data,file_win3)
					}
				}
				
				if (_trigger == 0)
				{
					data = "Нет события ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков: " + sub3 + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] +  " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output3)
				}

		}


// Конец третьего ТЗ 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Начало четвёртого ТЗ 

if (TZ4 == 1) // если ТЗ4 включено
{
		if (period[i].textContent.match(/3 чет/) == "3 чет" && use4[section_now] == undefined && time_minutes == 20 && time_seconds <= time_parse) 
		{
			temp_score = score[i].textContent.match(/\d{1,2}/g)
			first1[section_now] = temp_score[0]
			first2[section_now] = temp_score[1]
			second1[section_now] = temp_score[2]
			second2[section_now] = temp_score[3]
			use4[section_now] = 1 // для данного матча уже была проверка
			total_score12 = +first1[section_now] + +second1[section_now] // 12 индекс 1 - первый, 2 - две четверти прошлых складываем
			total_score22 = +first2[section_now] + +second2[section_now] // 22 индекс 2 - второй, 2 - две четверти прошлых складываем
			sub4 = total_score12 - total_score22
			sub5 = +first1[section_now] + +first2[section_now] - +second1[section_now] - +second2[section_now] // разница между первой и второй четвертью
			
			if (P1[section_now] == undefined || P1[section_now] == null) // если ещё не спарсены коэффициенты
			{
				temp_elems = elems[i].match(/-\d{1,3}\.5|\d{1,2}\.\d{1,3}|-|\d{2,3}/g)
				
					// проверяем адекватно ли взяли данные, нет ли прочерка была ли роспись
					if (temp_elems[0] != "-") // только если коэффициент получен назначаем, иначе нет
					{
						P1[section_now] = temp_elems[0] // коэффициент на победу первого
						P2[section_now] = temp_elems[2] // коэффициент на победу второго
						data = " Фиксируем коэффициенты ID: " + section_now + " " + get_date() + " Коэффициенты П1,П2: " + P1[section_now] + " ; " + P2[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
						save(data,file_output4)
					}
				
				if (P1[section_now] > P2[section_now])
				{
					favorite4[section_now] = 2
				}
				else if (P1[section_now] <= P2[section_now])
				{
					favorite4[section_now] = 1
				}
			}

			// считаем индикатор разница в четвертях совпадает ли с заданной в диапазоне score_period42 +- 2 (т.е. если задана 10, то от 8 до 12)
			temp_sub5 = false // разница между первой и второй четвертью входит в диапазон score_period42 +- 2 (т.е. если задана 10, то от 8 до 12)
			if (sub5 <= (score_period42+2) && sub5 >= (score_period42-2) && sub5 > 0) // разница по очкам между первой и второй четвертью более 
			{
				temp_sub5 = true
			}
			else if ( ((0-sub5) <= (score_period42+2)) && ((0-sub5) >= (score_period42-2)) && sub5 < 0)
			{
				temp_sub5 = true
			}

			// Разница очков между первой и второй командой не более score_period3 - по default 6
			// Разница по очкам больше Т1 и Т2 в каждой четверти больше на 20%
					get_koef(0,1)
					T1 = _TOTAL
					
					if (sub4 >= ((T1+T1)*score_period41) && temp_sub5 == true) // 
					{
					favorite4[section_now] = 1
//					get_koef(2,1) // ставим на 3.0 тоталы
					data = "Событие ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков: " + sub4 + " Фаворит: " + favorite4[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] + " Фора (" + fora[section_now] + ") ФораК= " + fora_koef[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output4)
					save(data,file_win4)
					}
					else if ( (0-sub4) >= ((T1+T1)*score_period41) && sub4 < 0 && temp_sub5 == true)
					{
					favorite4[section_now] = 2
//					get_koef(2,1) // ставим на 3.0 тоталы
					data = "Событие ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков: " + sub4 + " Фаворит: " + favorite4[section_now] + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Тотал (" + total[section_now] + ") TotalK= " + total_koef[section_now] + " Фора (" + fora[section_now] + ") ФораК= " + fora_koef[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output4)
					save(data,file_win4)
					}
					else
					{
					data = "Нет события ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков: " + sub4 + + " Тотал для 1.9= " + _TOTAL + " Коэффициент среднего тотала= " + _TOTAL_koef + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
					save(data,file_output4)
					}
		}

} // конец проверки на TZ4 триггер 1 - включено, 0 отключено

// Конец четвёртого ТЗ 
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Начало пятого ТЗ 

		if (period[i].textContent.match(/3 чет/) == "3 чет" && use5[section_now] == undefined && time_minutes == 20 && time_seconds <= time_parse) 
		{
		temp_score = score[i].textContent.match(/\d{1,2}/g)
		first1[section_now] = temp_score[0]
		first2[section_now] = temp_score[1]
		second1[section_now] = temp_score[2]
		second2[section_now] = temp_score[3]
		use5[section_now] = 1 // матч уже был
		_total_T1 = +first1[section_now] + +second1[section_now]
		_total_T2 = +first2[section_now] + +second2[section_now]
		sub5 = Math.abs(_total_T1 - _total_T2)
			
			_trigger = 0
			if (sub5 >= score_period5)
			{
//				ставим на ФОРУ второй команды				
				if (first1[section_now] > first2[section_now] && second1[section_now] > second2[section_now]) // выиграла первая команда в обоих четвертях
				{
				get_koef(3.2,2) // ФОРА на вторую команду, при кэффе 3.0
				fora[section_now] = temp_fora
				fora_koef[section_now] = temp_fora_koef
				_trigger = 1
				data = "Событие ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков между первым и вторым: " + sub5 +  " Фора на вторую команду (" + fora[section_now] + ") ФораК= " + fora_koef[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
				save(data,file_output5)
				save(data,file_win5)
				}
			
//				ставим на ФОРУ первой команды
				if (first1[section_now] < first2[section_now] && second1[section_now] < second2[section_now]) // выиграла первая команда в обоих четвертях
				{
				get_koef(3.1,2) // ФОРА на первую команду, при кэффе 3.0
				fora[section_now] = temp_fora
				fora_koef[section_now] = temp_fora_koef
				_trigger = 1
				data = "Событие ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков между вторым и первым: " + sub5 +  " Фора на первую команду (" + fora[section_now] + ") ФораК= " + fora_koef[section_now] + " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
				save(data,file_output5)
				save(data,file_win5)
				}		
			}
	
			if (_trigger == 0)
			{
			data = "Нет событие ID: " + section_now + " " + get_date() + " Идёт третья четверть, Счёт 2-х четвертей [" + first1[section_now] + ":" + first2[section_now] + "][" + second1[section_now] + ":" + second2[section_now] + "] Разница очков: " + sub5 +  " Время матча мин:сек " + time_minutes + ":" + time_seconds + " Ссылка на матч: " + url[section_now]
			save(data,file_output5)
			}
	
		}
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// Конец пятого ТЗ 

} // конец цикла i

} // конец try
catch (error)
{
	if (error == "Скрипт остановлен кнопкой стоп!")
	{
		break // остановка программы
	}
Tabs.go(1) // выходим на первую вкладку на всякий случай
save(error,file_output_error)
}


} // конец бесконечного цикла while
