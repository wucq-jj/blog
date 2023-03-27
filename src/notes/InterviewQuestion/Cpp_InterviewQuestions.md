---
title: c++面试题
category:
  - 面试题
tag: 
  - 面试题集合
editLink: false   # 不允许编辑页面
date: 2023-03-22
---

### 1.static 关键字作用

```
C++		static 关键字作用：
			1.修饰成员函数，静态成员之间可以相互访问，包括静态成员函数访问静态成员数据和访问静态成员函数。不能访问非静态成员函数和非静态成员数据。
				调用方法 类对象.静态成员函数  或者是类对象::静态成员函数。
				静态成员函数只属于类本身，随着类的加载而存在，不属于任何对象，是独立存在的。
			2.修饰成员数据，存储在全局静态区，静态数据成员定义时需要分配内存，所以无法在类声明中定义。不在类的声明中定义，是因为在类的声明中定义会
			导致每次类的初始化都包含该静态成员数据，与设计不符合。所有该类的实体对象（instance）都共用一个静态成员数据。
			3.protected 和 privated 修饰的静态函数无法被类外访问
```

### 2.malloc free 和 new delete 区别

```
C语言
	malloc、free 是库函数 	需要头文件支持	只是申请内存和释放内存，无法对自定义类型对象进行构造和析构
	malloc 	申请需要给定内存大小					成功返回 void * 需要强制转换		malloc 失败返回NULL				
C++	
	new delete 是关键字		需要编译器支持	new 会先申请足够的内存（底层用malloc 实现），然后调用类型的构造函数，初始化成员变量，最后返回自定义类型指针
				delete 会先调用类型的析构函数，然后释放内存（底层是用free 实现）
				new		申请无需给定内存大小 编译器会自行计算	成功返回 对象类型指针 无需强制转换	new 失败会抛出异常
```

### 3.C++ 内存分配

```
C++		内存5区
			堆区	动态申请内存，由程序员自己控制
			栈区	存放函数局部变量、函数参数、返回地址等，系统自动分配
			全局区/静态区	(.bss段和.data段)	存放全局变量和静态变量，程序结束时系统自动释放，
			常量存储区 		(.data段)			存放常量
			代码区 			(.text段)			存放二进制代码
	堆和栈区别
		栈 自动分配和释放	速度快	效率高但无法控制			内存地址连续	系统设定好的最大容量，	 向低地址扩展
		堆 手动分配和释放	速度慢	效率低但能控制，容易产生碎片	内存地址不连续	系统用链表来存储空闲内存地址，大小受限于系统的有效虚拟内存			向高地址扩展
```

### 4.面向对象三大特征

```
1.封装，使代码模块化。
2.继承，扩展已存在的代码模块，目的是实现了代码重用。（虚继承）
3.多态，实现接口重用。	实现方式细分为：重载和重写	重载：存在多个同名函数但是函数参数的个数和类型不同	重写：子类重新定义父类的虚函数方法
```

### 5.虚析构

```C++
析构函数为虚函数
	1.析构函数定义为虚函数时，基类指针指向派生类对象， 如果删除该指针(delete p;), 就会调用该指针指向的派生类析构函数，而派生类的析构函数又会自动调用
基类的析构函数，这样整个派生类对象就完全释放了。
	2.析构函数不定义为虚函数时，基类指针指向派生类对象，如果删除该指针(delete p;), 就只会调用该指针指向的基类析构函数，而不调用派生类的析构函数，这样就会造成派生类对象析构不完整。
	3.派生类指针操作派生类对象，基类析构函数不是虚函数：会先释放派生类资源，再释放基类资源，不会出现资源泄露。
    
    
举例：派生类指针操作派生类对象，基类析构函数不是虚函数
#include<iostream>
using namespace std;
class ClxBase{
public:
	ClxBase() {};
	~ClxBase() { cout << "Output from the destructor of class ClxBase!" << endl; };
 
	void DoSomething() { cout << "Do something in class ClxBase!" << endl; };
};
 
class ClxDerived : public ClxBase{
public:
	ClxDerived() {};
	~ClxDerived() { cout << "Output from the destructor of class ClxDerived!" << endl; };
 
	void DoSomething() { cout << "Do something in class ClxDerived!" << endl; };
};
int main(){
    ClxDerived *p = new ClxDerived;		// 派生类指针操作派生类对象
	p->DoSomething();
	delete p;
	system("pause");
	return 0;
}
//Do something in class ClxDerived!
//Output from the destructor of class ClxDerived
//Do something in class ClxBase
派生类指针操作派生类对象，基类析构函数不是虚函数，此时会先调用派生类析构函数，释放派生类资源，然后再调用基类析构函数，释放基类资源，不会出现资源泄露情况。
    
举例：基类指针操作派生类对象，基类析构函数不是虚函数
#include<iostream>
using namespace std;
class ClxBase{
public:
	ClxBase() {};
	~ClxBase() { cout << "Output from the destructor of class ClxBase!" << endl; };
 
	void DoSomething() { cout << "Do something in class ClxBase!" << endl; };
};
 
class ClxDerived : public ClxBase{
public:
	ClxDerived() {};
	~ClxDerived() { cout << "Output from the destructor of class ClxDerived!" << endl; };
 
	void DoSomething() { cout << "Do something in class ClxDerived!" << endl; };
};
int main(){
	ClxBase *p = new ClxDerived;		// 基类指针操作派生类对象
	p->DoSomething();
	delete p;
	system("pause");
	return 0;
}
//Do something in class ClxBase!
//Output from the destructor of class ClxBase!
基类指针操作派生类对象，基类析构函数不是虚函数；此时只调用了基类的析构函数，释放了基类的资源，没有调用派生类的析构函数，没有释放派生类资源。调用的DoSomething()也是基类定义的函数，不是派生类的。这样的只能删除基类资源，不能删除派生类资源，造成了内存泄漏。
    
举例：基类指针操作派生类对象，基类析构函数是虚函数
#include<iostream>
using namespace std;
class ClxBase{
public:
	ClxBase() {};
// 定义为虚函数
	virtual ~ClxBase() { cout << "Output from the destructor of class ClxBase!" << endl; };
 
	virtual void DoSomething() { cout << "Do something in class ClxBase!" << endl; };
};
 
class ClxDerived : public ClxBase{
public:
	ClxDerived() {};
	~ClxDerived() { cout << "Output from the destructor of class ClxDerived!" << endl; };
 
	void DoSomething() { cout << "Do something in class ClxDerived!" << endl; };
};
int main(){
	ClxBase *p = new ClxDerived;		// 基类指针操作派生类对象
	p->DoSomething();
	delete p;
	system("pause");
	return 0;
}
//Do something in class ClxDerived!
//Output from the destructor of class ClxDerived!
//Output from the destructor of class ClxBase!
基类指针操作派生类对象，基类析构函数是虚函数。释放资源时，会先调用派生类析构函数，释放派生类资源，然后在调用基类析构函数，释放基类资源。因为DoSomething()函数在基类中定位为虚函数，所以执行的时候也是调用的派生类的DoSomething()函数。
    
	基类析构函数定义为虚函数的情况说明：如果不需要基类对派生类及其对象进行操作，则不要把基类析构函数定义为虚函数，因为这样会增加开销，当类里面有定义虚
函数时，编译器会给类添加一个虚函数表，里面存放虚函数指针，这样会增加类的存储空间。所以，只有一个类被当做基类时，且有使用到基类指针来操作派生类的情况时，才会把基类的析构函数写成虚函数。
    
纯虚函数：是只有声明没有实现的虚函数。包含纯虚函数的类不能定义其对象。像这种只能用于被继承而不能直接创建对象的类被称为抽象类，抽象类是无法定义抽象类对象的。
virtual void func()=0;//这便是声明了一个纯虚函数 也就是在虚函数尾部加上" =0 " 一个虚函数便被声明成为了一个纯虚函数
// 等于0表示该函数仅声明而没有函数体
  	纯虚函数和虚函数的区别：
    	1.纯虚函数只有定义没有实现，虚函数既有定义也有实现
    	2.包含纯虚函数的类不能定义对象，而包含虚函数的可以。
    		如果子类想要实例化，纯虚函数必须被重写，如果派生类继承了包含纯虚函数的基类，却没有重纯虚函数。那么相当于子类也继承了纯虚函数，子类也变成了抽象类，不能被实例化。
```

### 6.C++ 空类有哪些成员函数 

```C++
6个 （8个）
缺省构造函数
拷贝构造函数属
析构函数
赋值运算符
取值运算符
取值运算符 const 

默认移动构造函数（C++11）；	
默认重载移动赋值操作符函数（C++11）。

class Empty{
public:
	Empty(); 							// 缺省构造函数
	Empty( const Empty& ); 				 // 拷贝构造函数	
	~Empty(); 							// 析构函数
	Empty& operator=( const Empty& ); 	  // 赋值运算符
	Empty* operator&(); 				 // 取址运算符
	const Empty* operator&() const; 	  // 取址运算符 const
};

1.缺省构造函数
    一种特殊的成员函数，当创建一个类对象时，调用构造函数对类的数据成员进行分配内存和初始化。
    构造函数的命名和类名完全相同。
    构造函数可以重载，可以多个，带参数。
2.缺省拷贝构造函数
    函数名和类名一样，有两种原型
    	Empty(Empty & a);
    	Empty(const Empty & a);
	参数为地址参数，为了防止无线构造，形成死循环
    const 的目的是常引用，不能改变里面的值
    为什么拷贝构造函数的参数必须是对象的引用而不是直接传值？
        因为通过传值的方式将实参传递给形参，这个中间本身就要经历一次对象的拷贝过程，而对象的拷贝又需要调用拷贝构造函数，如此一来就会进入死循环，无解，所以必须是对象的引用。
    拷贝构造函数除了能用对象的引用这样的参数外，还能有其他参数，但这个参数必须给出默认值。
        Empty(const Empty &e, int a = 5);
	如果声明拷贝构造函数，系统则会自动为类生成一个拷贝构造函数，但是他的功能非常简单，只能将原有对象的所有成员变量复制给当前创建的对象。
	举例：
#include<iostream>
using namespace std;
class Array
{
public:
	Array(){length = 0;num = NULL;}
	Array(int *A，int n);
	void setnum(int vallue,int index);
	int *getaddress();
	int getaddress();
	void display();
private:
	int length;
	int *num;
};
Array::Array(int *A,int n)
{
	num  = new int [n];
	length = n;
	for (int i = 0;i < n; i++)
		num[i] = A[i];
}
void Array::setnum(int value,int index)
{
	if(index < length)
		num[index] = value;
	else
		cout<<"index out of range!"<<endl;
}
void Array::display()
{
	for(int i = 0;i < length;i++)
		cout<<num[i]<<" ";
	cout<<endl;
}
int *Arry::getaddress()
{
	return num;
}
int main()
{
	int A[5] = {1,2,3,4,5};
	Array arr1(A,5);
	arr1.display();
	Array arr2(arr1);
	arr2.display();
	arr2.setnum(8,2);
	arr2.display();
	arr1.display();
	cout<<arr1.getaddress()<<" "<<arr2.getaddress()<<endl;
	return 0;
}
运行结果如下：
1 2 3 4 5
1 2 3 4 5
1 2 8 4 5
1 2 8 4 5
00331F58 00331F58
/*
在本例中，我们重新定义了一个Array类，可以理解为一个整形数组类，这个类中我们定义了两个成员变量：整形指针num和数组长度length。

类中定义了一个默认构造函数，声明了一个带参构造函数。默认构造函数很简单，带参构造函数则是用于将一个已有的数组全部拷贝给类对象。

除了两个构造函数之外，我们还定义四个成员函数，一个是用于修改数组中数值的setnum函数、一个打印数组中所有元素的display函数、一个返回数组首地址的函数getaddress和一个返回数组长度的函数getlength。除了默认构造函数之外和getlength函数之外，所有的函数在类外都有定义。

接下来我们看一下主函数。主函数中，我们先定义了一个数组，包含五个元素，分别是从1到5。之后用Array类创建对象arr1，并且用A数组初始化对象arr1，此时arr1对象相当于拥有一个数组，该数组包含5个元素，打印出来的结果是“1 2 3 4 5 ”，没有问题。之后用arr1对象初始化arr2对象，因为我们在类中没有显示地定义一个拷贝构造函数，因此系统会自动为我们生成一个拷贝构造函数，该拷贝构造函数的定义如下：
Array::Array(Array &a)
{
length = a.length;
num = a.num;
}
通过系统自动生成的拷贝构造函数完成arr2对象的创建，同样的arr2也是有5个元素的数组，打印出来的结果是“1 2 3 4 5 ”，同样没有问题。

之后我们调用成员函数setnum，将arr2对象下标为2的元素修改为8（原先是3）。此时打印arr2中数组元素，结果为“1 2 8 4 5 ”，正确，arr2第三个元素确实被修改掉了。

后我们再调用arr1.display()，奇怪的事情发生了，它的打印结果竟然也是“1 2 8 4 5 ”！我们之前并未修改过第三个元素的值的，这是怎么一回事呢？不急，我们再来看一下最后一句“cout<<arr1.getaddress()<<" "<<arr2.getaddress()<<endl;”其显示结果竟然是一样的！看到这里是不是有些明白了上面的问题呢？很明显，arr1和arr2所指向的数组是同一个数组，在内存中的位置是一致的，因此当我们利用对象arr2去修改数组中第三个元素的数值的时候，arr1中的数组也被修改了，其实它们本来就是使用的是同一个内存中的数组而已.
*/
拷贝构造函数的参数为引用，系统自动生成的拷贝构造函数功能简单，只是将arr1 的数组首地址直接赋值给arr2的数值首地址，arr1 和 arr2 的数据成员 num 其实是同一个内存，同一个数组。 要避免这种情况，就要自己加上一个拷贝构造函数。

	例子：    
#include<iostream>
using namespace std;
class Array
{
public:
	Array(){length = 0;num = NULL;}
	Array(int *A,int n);
	Array(Array &a);
	void setnum(int value,int index);
	int *getaddress();
	void display();
	int getlength(){return length;}
private:
	int length;
	int *num;
};
Array::Array(Array&a)
{
	if(a.num!=NULL)
	{
		length = a.length;
		num = new int [length];
		for(int i = 0;i < length;i++)
			num[i] = a.num[i];
	}
	else
	{
		length = 0;
		num = 0;
	}
}
Array::Array(int *A,int n)
{
	num = new int [n];
	length = n;
	for(int i = 0;i < n;i++)
		num[i] = A[i];
}
void Array::setnum(int value,int index)
{
	if(index <length)
		num[index] = value;
	else
		cout<<"index out of range!"<<endl;
}

void Array::display()
{
	for (int i = 0;i < length;i++)
		cout<<num[i]<<" ";
	cout<<endl;
}
int *Array::getaddress()
{
	return num;
}

int main()
{
	int A[5] = {1,2,3,4,5};
	Array arr1(A,5);
	arr1.display();
	Arry arr2(arr1);
	arr2.display();
	arr2.setnum(8,2);
	arr2.display();
	arr1.display();
	cout<<arr1.getaddress();" "<<arr2.getaddress()<<endl;
	return 0;
}

运行结果如下：
1 2 3 4 5
1 2 3 4 5
1 2 8 4 5
1 2 3 4 5
00311F58 00487268

3.缺省析构函数
    析构函数只有一个，不能重载
    析构函数不能有参数
    在主函数中，析构函数在 return 语句之前执行

4.缺省赋值运算符
    赋值运算符是对一个已经初始化的对象进行赋值操作
   	如果不想写拷贝构造函数和赋值函数，又不允许别人使用编译器生成的缺省函数，最简单的办法是将拷贝构造函数和赋值声明为私有函数。
   
5.缺省取值运算符

6.缺省取值运算符 const
    
    #include <iostream>
using namespace std;

class A
{
public:
    A()
    {
        cout<<"构造函数"<<endl;
    }
    ~A()
    {
        cout<<"希构函数"<<endl;
    }
    A(const A &)
    {
        cout<<"拷贝构造函数"<<endl;
    }
    A& operator=(const A &)
    {
        cout<<"赋值运算"<<endl;
    }
    A* operator&()
    {
        cout<<"取地址"<<endl;
    }
    const A* operator&()const
    {
        cout<<"const取地址"<<endl;
    }
};

int main(int argc, char **argv)
{
    A c1;		//构造
    A c2 = c1;	//拷贝构造
    c2 = c1;	//赋值运算
    A *pa = &c1;//取地址
    const A c3; //构造
    const A * pb = &c3;//const 取地址

    return 0;
}


1.C++11 新增move语义：源对象资源的控制权全部交给目标对象，可以将原对象移动到新对象， 用于a初始化b后，就将a析构的情况；
2.移动构造函数的参数和拷贝构造函数不同，拷贝构造函数的参数是一个左值引用，但是移动构造函数的初值是一个右值引用；
3.临时对象即将消亡，并且它里面的资源是需要被再利用的，这个时候就可以使用移动构造。移动构造可以减少不必要的复制，带来性能上的提升。

#define _CRT_SECURE_NO_WARNINGS

#include <cstdio>
#include <cstdlib>
#include <cstring>

#include <iostream>
#include <string>

class MyClass
{
public:
    MyClass(const char * str = nullptr);  // 默认带参构造函数 // 默认构造函数指不带参数或者所有参数都有缺省值的构造函数
    ~MyClass(void);  // 默认析构函数
    MyClass(const MyClass &);  // 默认拷贝构造函数
    MyClass & operator =(const MyClass &);  // 默认重载赋值运算符函数
    MyClass * operator &();  // 默认重载取址运算符函数
    MyClass const * operator &() const;  // 默认重载取址运算符const函数
    MyClass(MyClass &&);  // 默认移动构造函数
    MyClass & operator =(MyClass &&);  // 默认重载移动赋值操作符函数

private:
    char *m_pData;
};

// 默认带参构造函数
MyClass::MyClass(const char * str)
{
    if (!str)
    {
        m_pData = nullptr;
    } 
    else
    {
        this->m_pData = new char[strlen(str) + 1];
        strcpy(this->m_pData, str);
    }
    std::cout << "默认带参构造函数" << " this addr: " << this << std::endl;
}

 // 默认析构函数
MyClass::~MyClass(void)
{
    if (this->m_pData)
    {
        delete[] this->m_pData;
        this->m_pData = nullptr;
    }
    std::cout << "默认析构函数" << " this addr: " << this << std::endl;
}

// 默认拷贝构造函数
MyClass::MyClass(const MyClass &m)
{
    if (!m.m_pData)
    {
        this->m_pData = nullptr;
    } 
    else
    {
        this->m_pData = new char[strlen(m.m_pData) + 1];
        strcpy(this->m_pData, m.m_pData);
    }
    std::cout << "默认拷贝构造函数" << " this addr: " << this << std::endl;
}

// 默认重载赋值运算符函数
MyClass & MyClass::operator =(const MyClass &m)
{
    if ( this == &m ) {
        return *this;
    }
    
    delete[] this->m_pData;
    if (!m.m_pData)
    {
        this->m_pData = nullptr;
    } 
    else
    {
        this->m_pData = new char[strlen(m.m_pData) + 1];
        strcpy(this->m_pData, m.m_pData);
    }

    std::cout << "默认重载赋值运算符函数" << " this addr: " << this << std::endl;
    return *this;
}

// 默认重载取址运算符函数
MyClass * MyClass::operator &()
{
    std::cout << "默认重载取址运算符函数" << " this addr: " << this << std::endl;
    return this;
}

// 默认重载取址运算符const函数
MyClass const * MyClass::operator &() const
{
    std::cout << "默认重载取址运算符const函数" << " this addr: " << this << std::endl;
    return this;
}

// 默认移动构造函数
MyClass::MyClass(MyClass && m):
    m_pData(std::move(m.m_pData))
{
    std::cout << "默认移动构造函数" << std::endl;
    m.m_pData = nullptr;
}

// 默认重载移动赋值操作符函数
MyClass & MyClass::operator =(MyClass && m)
{
    if ( this == &m ) {
        return *this;
    }

    this->m_pData = nullptr;
    this->m_pData = std::move(m.m_pData);
    m.m_pData = nullptr;
    std::cout << "默认重载移动赋值操作符函数" << " this addr: " << this << std::endl;
    return *this;
}

void funA(MyClass a)
{
    std::cout << "调用funA函数" << " param addr: " << &a << std::endl;
}

void mytest1(void)
{
    std::cout << "mytest1 >>>>" << std::endl;
    MyClass myclass1; // 等价于 MyClass myclass1 = MyClass(); // 调用默认带参构造函数
    myclass1 = MyClass(); // MyClass()为右值，需要右值引用 // 先调用默认带参构造函数，然后调用默认重载取址运算符函数，最后调用默认重载移动赋值操作符函数
    std::cout << "<<<<< mytest1" << std::endl;
    // 析构两次 1: myclass1 = MyClass()中的MyClass() 2: MyClass myclass1
}

void mytest2(void)
{
    std::cout << "mytest2 >>>>" << std::endl;
    MyClass myclass1; // 等价于 MyClass myclass1 = MyClass(); // 调用默认带参构造函数
    MyClass myclass2(myclass1);  // 调用默认拷贝构造函数
    myclass2 = myclass1; // myclass2为左值，所以此操作为赋值操作，会调用默认重载取址运算符const函数，然后调用默认重载赋值运算符函数
    funA(myclass1); // 参数传值会导致赋值操作，会调用默认拷贝构造函数，然后funA函数调用默认重载取址运算符函数取得参数
    funA(std::move(myclass1)); // funA函数的参数现为右值，会调用默认移动构造函数，然后funA函数调用默认重载取址运算符函数取得参数
    // 在移动构造函数中对于基本类型所谓移动只是把其值拷贝，对于如string这类类成员来说才会真正的所谓资源移动
    std::cout << "<<<<< mytest2" << std::endl;
}

void mytest3(void)
{
    std::cout << "mytest3 >>>>" << std::endl;
    funA(MyClass()); // 会调用默认带参构造函数，生成该类的对象，然后funA函数调用默认重载取址运算符函数取得参数
    std::cout << "<<<<< mytest3" << std::endl;
    // 析构一次 1: funA(MyClass())中的MyClass()形成的对象，是在funA函数结束调用的时候，调用默认析构函数
}

void mytest(void)
{
    std::cout << "<<<<<<<<<<<<<<<<<<<<<<<<<" << std::endl;

    mytest1();
    mytest2();
    mytest3();

    std::cout << "<<<<<<<<<<<<<<<<<<<<<<<<<" << std::endl;
}

int main(int argc, char * argv[], char * envp[])
{
    mytest();

    system("pause");
    return 0;
}

输出结果 <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

<<<<<<<<<<<<<<<<<<<<<<<<<
mytest1 >>>>
默认带参构造函数 this addr: 0x7ffca6b2eed8
默认带参构造函数 this addr: 0x7ffca6b2eed0
默认重载取址运算符函数 this addr: 0x7ffca6b2eed0
默认重载移动赋值操作符函数 this addr: 0x7ffca6b2eed8
默认析构函数 this addr: 0x7ffca6b2eed0
<<<<< mytest1
默认析构函数 this addr: 0x7ffca6b2eed8
mytest2 >>>>
默认带参构造函数 this addr: 0x7ffca6b2eed8
默认拷贝构造函数 this addr: 0x7ffca6b2eed0
默认重载取址运算符const函数 this addr: 0x7ffca6b2eed8
默认重载赋值运算符函数 this addr: 0x7ffca6b2eed0
默认拷贝构造函数 this addr: 0x7ffca6b2eeb8
调用funA函数 param addr: 默认重载取址运算符函数 this addr: 0x7ffca6b2eeb8
0x7ffca6b2eeb8
默认析构函数 this addr: 0x7ffca6b2eeb8
默认移动构造函数
调用funA函数 param addr: 默认重载取址运算符函数 this addr: 0x7ffca6b2eeb0
0x7ffca6b2eeb0
默认析构函数 this addr: 0x7ffca6b2eeb0
<<<<< mytest2
默认析构函数 this addr: 0x7ffca6b2eed0
默认析构函数 this addr: 0x7ffca6b2eed8
mytest3 >>>>
默认带参构造函数 this addr: 0x7ffca6b2eed8
调用funA函数 param addr: 默认重载取址运算符函数 this addr: 0x7ffca6b2eed8
0x7ffca6b2eed8
默认析构函数 this addr: 0x7ffca6b2eed8
<<<<< mytest3
<<<<<<<<<<<<<<<<<<<<<<<<<

```

### 7.谈谈拷贝构造函数和赋值运算符的认识

```
1.拷贝构造函数生成新的对象，而赋值运算符不是
2.由于拷贝构造函数是直接构造一个新的类对象， 所以在初始化这个对象之前不需要检查原对象和新对象是否相同，而赋值运算符需要这个操作，另外赋值运算中如果原来的对象有内存分配需要先把内存释放掉
3.在类中有指针类型成员变量时，一定要重写拷贝构造函数和赋值操作符，不能使用默认的，原因是因为不重写的话，是浅拷贝，当一个对象释放后，另外一个对象在释放就报错了。
```

### 8.用 C++设计一个不能被继承的类

```C++
class A :
{
	private:
		A();
}
class B : public A
{

}
B 就不能继承A 因为基类A的构造函数是私有的 无法构造，构造函数的顺序是先基类构造函数，然后是成员函数，然后是派生类
    
要是构造函数是私有的，也不能创建对象了，只有通过特殊方法，在基类中写一个静态成员函数来创建对象
例子：
#include <iostream>
using namespace std;
 
class A{
private:
	A(){
		;
	}
public:
	static A* get(){
		A* a1 = new A();
		return a1;
	}
	~A(){
		;
	}
};
 
int main(){
 	A b;			//错误
	A* a = A::get();	//正确
	
	return 0;
 
}
```

### 9.虚继承

```C++

	A
 /	    \        
 B		 C
 \      /
    D
菱形继承：即两个派生类继承同一个基类，同时两个派生类又作为基本继承给同一个派生类。这种继承形如菱形，故又称为菱形继承。
菱形继承举例： D 多继承 B C，而 B继承A，C又继承A        
菱形继承，菱形继承的问题，数据冗余和二义性

class Person//人类
{
	public :
	string _name ; // 姓名
};
class Student : public Person//学生类
{
protected :
    int _num ; //学号
};
class Teacher : public Person//老师类
{
protected :
    int _id ; // 职工编号
};
class Assistant : public Student, public Teacher//助理类
{
protected :
    string _majorCourse ; // 主修课程
};
void Test ()
{
    // 这样会有二义性无法明确知道访问的是哪一个
    Assistant a ;
    a._name = "peter";
    
    // 需要显示指定访问哪个父类的成员可以解决二义性问题，但是数据冗余问题无法解决
    a.Student::_name = "xxx";
    a.Teacher::_name = "yyy";
}

要解决这个问题，要用菱形虚拟继承
    虚拟继承可以解决菱形继承的二义性和数据冗余的问题。如上面的继承关系，在Student和Teacher的继承Person时使用虚拟继承，即可解决问题。需要注意的是，虚拟继承不要在其他地方去使用。
    class Person
{
public :
    string _name ; // 姓名
};
class Student : virtual public Person
{
protected :
    int _num ; //学号
};
class Teacher : virtual public Person
{
protected :
    int _id ; // 职工编号
};
class Assistant : public Student, public Teacher
{
protected :
    string _majorCourse ; // 主修课程
};
void Test ()
{

    Assistant a ;
    a._name = "peter";
}
```

### 10.继承和组合的区别？什么时候用继承？什么时候用组合？

```
	public继承 是一种is-a的关系。就是说每个派生类对象都是一个基类对象
    组合是一种has-a的关系。假设B组合了A，每个B对象中就都有A。
   优先使用对象组合而不是类继承。
    继承允许你根据基类的实现来定义派生类的实现
    继承一定程度破坏了基类的封装
    组合类之间没有很强的依赖关系，耦合度低。优先使用对象组合有助于你保持每个类被封装。
```

### 11.什么函数不能被声明为虚函数

```
普通函数	构造函数	内联函数	静态成员函数	友元函数	不会被继承的基类的析构函数（没必要）
    构造函数不能是虚函数的原因：当类中有虚函数时，编译器会生成一个虚函数表，虚函数表中存储虚函数地址。虚函数表是由编译器自动生成维护的，当存在虚函数时，每个类对象都会自动生成一个虚函数指针（vptr）指向虚函数表，在实现多态时，基类和派生类都有vptr; vptr的初始化：当对象创建时，编译器对vptr指针进行初始化，在定义派生类时，vptr先会指向基类的虚函数表，在基类构造完成之后，派生类就会指向自己的虚函数表。如果构造函数是虚函数的话，那么调用构造函数时就需要去找vptr,但是此时的vptr还没有初始化。
```

### 12.哪几个成员函数不能被继承

```
    构造函数，拷贝构造函数 析构函数 赋值运算符重载函数
```

### 13.简述类成员函数的重写、重载和隐藏的区别

```C++
重载：
	class A
    {
    public:
      void fun(int tmp);
      void fun(float tmp); // 重载 参数类型不同（相对于上一个函数）
      void fun(int tmp, float tmp1); // 重载 参数个数不同（相对于上一个函数）
      void fun(float tmp, int tmp1); // 重载 参数顺序不同（相对于上一个函数）
      int fun(int tmp); // error: 'int A::fun(int)' cannot be overloaded 错误：**注意重载不关心函数返回类型**
    }
隐藏：
    #include <iostream>
    using namespace std;
    class Base
    {
    public:
      void fun(int tmp, float tmp1) { cout << "Base::fun(int tmp, float tmp1)" << endl; }
    };
    class Derive : public Base
    {
    public:
      void fun(int tmp) { cout << "Derive::fun(int tmp)" << endl; } // 隐藏基类中的同名函数
    };
    int main()
    {
      Derive ex;
      ex.fun(1); // Derive::fun(int tmp)
      ex.fun(1, 0.01); // error: candidate expects 1 argument, 2 provided
//	ex.Base::fun1(1, 0.01);        正确写法
      return 0;
    }
重写：
    #include <iostream>
    using namespace std;
    class Base
    {
    public:
      virtual void fun(int tmp) { cout << "Base::fun(int tmp) : " << tmp << endl; }
    };
    class Derived : public Base
    {
    public:
      virtual void fun(int tmp) { cout << "Derived::fun(int tmp) : " << tmp << endl; } // 重写基类中的 fun 函数
    };
    int main()
    {
      Base *p = new Derived();
      p->fun(3); // Derived::fun(int) : 3
      return 0;
    }
重写和重载的区别：
    范围区别：对于类中的函数的重载或者重写而言，重载在同一个类的内部，而重写则是在不同的类中（基类和派生类）
    参数区别：重载的函数需要与原函数有相同的函数名，不同的参数列表，不关注函数的返回值类型；重写的函数的函数名，参数列表和返回值类型都必须和原函数相同，父类中被重写的函数需要 virtual 修饰。
    virtual 关键字：重写的函数基类中必须有 virtual 关键字修饰，重载函数则不需要。
    
隐藏和重写、重载的区别：
    范围却别：隐藏和与重载范围不同，隐藏在不同的类中（基类和派生类）
    参数区别：隐藏函数和被隐藏的参数列表可以相同，也可以不相同，但函数名必须相同；当参数不同时，无论基类中函数是否被 virtual 修饰，基类函数都是被隐藏，而不是被重写。

```

### 14.多态的实现原理

```
1.C++ 分静态多态 和 动态多态
	静态多态就是重载，在编译器决定，在编译时就确定函数地址。
	动态多态就是通过继承重写基类的虚函数来实现的，因为是在运行时决定的，所以被称为动态多态。运行时在虚函数表中寻找到函数地址。
2.在基类的函数前加上 virtual 关键字，在派生类中重写该函数，运行时将会根据对象的实际类型来调用相应的函数。
   
原理：
    当一个类出现虚函数或者子类继承了虚函数后，就会在该类中产生一个虚函数表，虚函数表里的每一个元素是指向每一个虚函数的指针。被该类声明的对象还会包含一个虚函数表指针，指向该类的虚函数表地址。当一个类要调用虚函数时，会先将对象内存中的（vtable_ptr）虚函数表指针指向该类的虚函数表（vtable），虚函数表中在寻找到
里面的指针指向想用调用的虚函数，从而完成虚函数调用。从而实现动态联编。
```

### 15.谈谈容器 vector list array 

```
	array 大小固定，元素在内存中时连续存储的，使用时无法改变，只允许访问或者替换存储元素
	list 双链表容器，前后靠指针维系，元素可以分散在内存中，不一定是连续存储
	vector 底层是动态数组实现，元素在内存中连续，当需要扩容时，并不是在原有基础上简单的叠加，而是重新申请一块更大的内存，然后逐个复制过去，销毁旧的内存。（这个时候指向旧内存空间的迭代器失效，当操作容器时，需要及时更新）
	
顺序存储和链式存储
	顺序存储：顺序存储是指在内存中开辟连续的存储空间来存放数据，代表：数组
		优点：查询速度快，便利效率高
		缺点：增加，删除效率低
	链式存储：链式存储的存储空间不连续，他是通过指针来指向下一个元素或者上一个元素的地址来定位到该元素的，链式存储由数据域和指针域两部分组成，通过指针的穿插，从而形成了一个链表
		优点：增加、删除效率高
		缺点：遍历、查询效率低
```

### 16.const关键字

```
C++
        const 引用：常量引用 不能修改引用对象
        const 修饰成员函数被称为 常函数 (不能修饰全局函数，因为static 函数没有this指针)	举例： void test(void) const;
这是C++的规则，const修饰符用于表示函数不能修改成员变量的值，该函数必须是含有this指针的类成员函数，函数调用方式为thiscall，而类中的static函数本质上是全局函数，调用规约是__cdecl或__stdcall,不能用const来修饰它。一个静态成员函数访问的值是其参数、静态数据成员和全局变量，而这些数据都不是对象状态的一部分。而对成员函数中使用关键字const是表明：函数不会修改该函数访问的目标对象的数据成员。既然一个静态成员函数根本不访问非静态数据成员，那么就没必要使用const了。
        	该函数不能修改成员变量
        	不能调用非 const 成员函数，因为任何非 const 成员函数会有修改成员变量的企图
        const 修饰对象
        	对象任何成员都不能被修改
        	const 类对象只能调用 const 成员函数
```

### 17.深浅拷贝

```
浅拷贝：只复制某个对象的指针, 而不复制对象本身, 新旧对象还是共享同一块内存.（在类中有指针类型成员变量时，一定要重写拷贝构造函数和赋值操作符，不能使用默认的，原因是因为不重写的话，是浅拷贝，当一个对象释放后，另外一个对象在释放就报错了）
深拷贝：在拷贝的过程中会另外创造一个一模一样的对象. 新对象跟原对象不共享内存, 修改新对象不会改到原对象
```

### 18.线程池

```
我们使用线程的时候就去创建一个线程，这样实现起来非常简便，但是就会有一个问题：如果并发的线程数量很多，并且每个线程都是执行一个时间很短的任务就结束了，这样频繁创建线程就会大大降低系统的效率，因为频繁创建线程和销毁线程需要时间。
  那么有没有一种办法使得线程可以复用，就是执行完一个任务，并不被销毁，而是可以继续执行其他的任务呢？
  线程池是一种多线程处理形式，处理过程中将任务添加到队列，然后在创建线程后自动启动这些任务。线程池线程都是后台线程。每个线程都使用默认的堆栈大小，以默认的优先级运行，并处于多线程单元中。如果某个线程在托管代码中空闲（如正在等待某个事件）, 则线程池将插入另一个辅助线程来使所有处理器保持繁忙。如果所有线程池线程都始终保持繁忙，但队列中包含挂起的工作，则线程池将在一段时间后创建另一个辅助线程但线程的数目永远不会超过最大值。超过最大值的线程可以排队，但他们要等到其他线程完成后才启动。
    
线程池的组成结构
    任务队列：存储需要处理的任务，由工作的线程来处理这些任务
    	1.通过线程池提供的 API 函数，将一个待处理的任务添加到任务队列，或者从任务队列中删除
    	2.已处理的任务会从任务队列中删除
    	3.线程池的使用者，也就是调用线程池函数往任务队列中添加任务的线程就是生产者线程
    工作线程：任务队列任务的消费者，N 个
    	1.线程池中维护了一定数量的工作线程，他们的作用是不停的读任务队列，从里边取出任务并处理
    	2.工作的线程相当于是任务队列的消费者角色
    	3.如果任务队列为空，工作的线程将会被阻塞(使用条件变量/信号量阻塞)
    	4.如果阻塞之后有了新的任务，由生产者将阻塞解除，工作线程开始工作
    管理者线程：不处理任务队列中的任务，1个
    	1.它的任务是周期性的对任务队列中的任务数量以及处于忙状态的工程线程个数进行检测
    	2.当任务过多的时候，可以适当的创建一些新的工作线程
    	3.当任务过少的时候，可以适当的销毁一些工作线程
```

### 19.构造函数不能为虚函数

```
虚函数的调用需要虚函数表指针，该指针存放在对象的内存空间中，若构造函数生命为虚函数，那么由于对象还没创建，没有内存空间，更没有指向虚函数表的虚函数表指针，就无法调用虚构造函数，若构造函数为虚函数的话，首先就会调用虚函数表指针，但是现在对象还没创建，根本就没有改指针，无法操作。
```







