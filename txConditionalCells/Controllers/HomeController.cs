using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using txConditionalCells.Models;

namespace txConditionalCells.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public string MergeDocument(string Document)
        {
            using (TXTextControl.ServerTextControl tx = new TXTextControl.ServerTextControl())
            {
                tx.Create();
                tx.Load(Convert.FromBase64String(Document), TXTextControl.BinaryStreamType.InternalUnicodeFormat);

                using (TXTextControl.DocumentServer.MailMerge mailMerge = new TXTextControl.DocumentServer.MailMerge())
                {
                    mailMerge.TextComponent = tx;
                    mailMerge.FieldMerged += MailMerge_FieldMerged;

                    string data = System.IO.File.ReadAllText(Server.MapPath("~/App_Data/data.json"));
                    mailMerge.MergeJsonData(data, false);
                }

                byte[] results;

                tx.Save(out results, TXTextControl.BinaryStreamType.InternalUnicodeFormat);
                return Convert.ToBase64String(results);
            }
        }

        private void MailMerge_FieldMerged(object sender, TXTextControl.DocumentServer.MailMerge.FieldMergedEventArgs e)
        {
            // custom field handling
            if (e.TableCell == null)
                return;

            // if TableCell.Name has instructions, create a CellFilterInstructions object
            // and evaluate the instructions and set the table cell color
            if (e.TableCell.Name != "")
            {
                CellFilterInstructions instructions = (CellFilterInstructions)JsonConvert.DeserializeObject(e.TableCell.Name, typeof(CellFilterInstructions));

                // retrieve the color
                Color? color = instructions.GetColor(e.MailMergeFieldAdapter.ApplicationField.Text);

                // apply the color
                if (color != null)
                    e.TableCell.CellFormat.BackColor = (Color)color;
            }
        }
    }
}