export default function (str: string, length: number) {
    if(str == null || str?.length <= length) return str;

    return str.substring(0, length - 1) + "**\u2026**";
}
