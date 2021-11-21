var str = "|| Developer Indonesia Jeffry Azhari Rosman. Kuliah BSI aja!! ||";
var a1 = str.search("||") + 1;
var a2 = (a1 + 9) + Math.min(10, 21, 23, 42, 12, 45, 74.33, 12.4532, 44, 50.6778, 10.9747, 99.1, 99.2334);
var a3 = str.replace(/developer/i, "Programmer");
var a4 = a2 + a3.length + 15;

function baca(n) {
    var b1 = (str.length - 24) + n;
    var b2 = b1 + Math.max(1.2, 33.1, 49, 2.1234, 44.565678877, 50, 22.7778898, 50, 49, 41.676677);
    var b3 = Math.pow((b2 + 10), 1);
    return b3;
}

var c1 = baca(a4) - 100;
var c2 = str[str.search("||")] + str[a1];
var c3 = (Math.sqrt(c1) - 9) + " Mr." + str[str.search("Jeffry")] + a3[a3.search("Azhari")] + a3[a3.search("Rosman")] + " ";
var c4 = c2 + " " + a3[a3.search("BSI")] + a3[a3.search("BSI") + 1] + str[str.search("BSI") + 2] + " ";
var c5 = str[str.search("aja")] + str[str.search("aja") + 1] + str[str.search("aja") + 2] + " " + a1;

const Nilai = c3 + c4 + c5;

module.exports = Nilai;