---
title: QT 好用的自定义工具函数
index: true
comment: false
icon: edit
editLink: false
date: 2023-05-10
pageview: true
Word: true
footer: 天行健，君子以自强不息；地势坤，君子以厚德载物
---

# 自定义好用的QT工具函数

## QTool.h

```c++
#ifndef TOOL_H
#define TOOL_H

#include <QObject>
#include <QJsonArray>
#include <QJsonDocument>
#include <QJsonObject>

class Tool
{
public:
    Tool();
    static Tool * instance()
    {
        Tool * tool = new Tool;
        return tool;
    }


    void QJsonArrToQStr(const QJsonArray & c_qjsonarrSrc, QString & qstrDst);
    void QStrToQJsonArr(const QString & c_qstrSrc, QJsonArray & qjsonarrDst);

    void QJsonObjToQStr(const QJsonObject & c_qjsonobjSrc, QString & qstrDst);
    void QStrToQJsonObj(const QString & c_qstrSrc, QJsonObject & qjsonobjDst);
};

#endif // TOOL_H

```



## QTool.cpp

```c++
#include "tool.h"

Tool::Tool()
{

}

void Tool::QJsonArrToQStr(const QJsonArray &c_qjsonarrSrc, QString &qstrDst)
{
    QJsonDocument doc(c_qjsonarrSrc);
    qstrDst = QString(doc.toJson(QJsonDocument::Compact));
}

void Tool::QStrToQJsonArr(const QString &c_qstrSrc, QJsonArray &qjsonarrDst)
{
    QJsonDocument doc;
    doc = QJsonDocument::fromJson(c_qstrSrc.toLocal8Bit());
    qjsonarrDst = doc.array();
}

void Tool::QJsonObjToQStr(const QJsonObject &c_qjsonobjSrc, QString &qstrDst)
{
    QJsonDocument doc(c_qjsonobjSrc);
    qstrDst = QString(doc.toJson(QJsonDocument::Compact));
}

void Tool::QStrToQJsonObj(const QString &c_qstrSrc, QJsonObject &qjsonobjDst)
{
    QJsonDocument doc;
    doc = QJsonDocument::fromJson(c_qstrSrc.toUtf8());
    qjsonobjDst = doc.object();
}

```

