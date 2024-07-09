/**
 * Author: Libra
 * Date: 2024-06-04 17:55:05
 * LastEditors: Libra
 * Description:
 */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TableBody, TableCell, TableRow, Table } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx/xlsx.mjs";
import "./page.css";

export default function ToolPage() {
  const [fileName, setFileName] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [oriData, setOriData] = useState("");

  const [sheetData, setSheetData] = useState([]); // [
  const [isModalOpen, setIsModalOpen] = useState(false);

  const transformData = (text: string) => {
    text = text.replace(/^(\d+)[、．．](\.?)/gm, "$1.");
    text = text.replace(/([A-Z])[、．．](\.?)/gm, "$1.");
    let questionArr = text.split(/^\d+\.+/gm).slice(1);
    const data = questionArr.map((item) => {
      return item.split(
        new RegExp(answer ? `[A-Z][.]|${answer}` : `[A-Z][.]`, "gm")
      );
    });
    return data;
  };
  const transformData2 = (text: string) => {
    text = text.replace(/^(\d+)[、．．](\.?)/gm, "$1.");
    const questionArr = text.split(/^\d+\.+/gm).slice(1);
    return questionArr.map((item) => {
      return answer ? item.split(new RegExp(`${answer}`, "gm")) : [item];
    });
  };
  // 填空题
  const transformData3 = (text: string) => {
    text = text
      .replace(/^(\d+)[、．．](\.?)/gm, "$1.")
      .replace(/[\uFF08-\uFF09]/g, (match) => (match === "\uFF08" ? "(" : ")"))
      .replace(/_{2,}/g, "()");
    let questionArr = text.split(/^\d+\.+/gm).slice(1);
    let reg = /\((.*?)\)/g;
    return questionArr.map((item) => {
      let match;
      let res = [item.replace(reg, "(  )")];
      // eslint-disable-next-line no-cond-assign
      while ((match = reg.exec(item))) {
        let m = match[1].replace(/\s/g, "");
        m && res.push(m);
      }
      return res;
    });
  };
  const exportExcel = (data: any) => {
    if (answer) {
      let answers: any = [];
      let maxLen = Math.max(...data.map((item: any) => item.length)) - 1;
      data = data.map((item: any, index: any) => {
        answers.push(item.pop());
        while (item.length < maxLen) {
          item.push("");
        }
        item.push(answers[index]);
        return item;
      });
    }
    console.log(data);
    setSheetData(data);
    setIsModalOpen(true);
  };
  const exportExcel2 = (data: any) => {
    data = data.map((item: any) =>
      answer ? [item[0], "正确", "错误", item[1]] : [item[0], "正确", "错误"]
    );
    setSheetData(data);
    setIsModalOpen(true);
  };

  const exportExcel3 = (data: any) => {
    setSheetData(data);
    setIsModalOpen(true);
  };

  const checkAndExport = () => {
    let workbook = XLSX.utils.book_new();
    let allDataSheet = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, allDataSheet, "All Data");
    XLSX.writeFile(workbook, fileName ? `${fileName}.xlsx` : "试卷.xlsx");
  };

  const copyTable = () => {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector("table")!);
    const selection = window.getSelection();
    if (!selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    console.log(selection);
    document.execCommand("copy");
    selection.removeAllRanges();
    toast("表格已复制到剪贴板");
  };

  return (
    <div className="p-4">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[800px]">
          <DialogHeader>
            <DialogTitle>试题列表</DialogTitle>
          </DialogHeader>
          <div className="text-xl bg-slate-300 rounded-md p-2 text-center">
            总题数：<span className="font-bold ">{sheetData.length}</span>
          </div>
          <div className="max-h-[800px] overflow-auto">
            <Table>
              <TableBody>
                {sheetData.map((row: string[], rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <TableCell
                        key={cellIndex}
                        className=" min-w-16 text-center"
                      >
                        <div className="text">{cell}</div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button onClick={copyTable} variant="secondary">
              复制表格
            </Button>
            <Button onClick={checkAndExport} variant="default">
              导出Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className=" flex justify-start items-center mb-4">
        <div className="flex-1 flex justify-start items-center">
          <span className=" w-20">文件名：</span>
          <Input
            placeholder="生成文件名，默认为 试卷"
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>
        <div className="flex-1 flex justify-start items-center ml-4">
          <span className=" w-40">参考答案匹配：</span>
          <Input
            placeholder="填空题自动匹配答案, 不填默认没有参考答案"
            onChange={(e) => setAnswer(e.target.value)}
          />
        </div>
      </div>
      <Textarea rows={20} onChange={(e) => setOriData(e.target.value)} />
      <div className="mt-4 flex justify-start items-center gap-2">
        <Button
          onClick={() => exportExcel(transformData(oriData))}
          variant="default"
        >
          选择题
        </Button>
        <Button
          onClick={() => exportExcel2(transformData2(oriData))}
          variant="default"
        >
          判断题
        </Button>
        <Button
          onClick={() => exportExcel3(transformData3(oriData))}
          variant="default"
        >
          填空题
        </Button>
      </div>
    </div>
  );
}
