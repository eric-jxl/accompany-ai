// MarkdownRenderer.tsx
import React, {useMemo} from 'react';
import MarkdownIt, {type Options} from 'markdown-it';
import DOMPurify, {type Config as DOMPurifyConfig} from 'dompurify';

// 定义 Props 接口
interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * 要渲染的 Markdown 字符串。
     */
    content: string;

    // @ts-ignore
    /**
     * 传递给 markdown-it 构造函数的选项。
     * @default {}
     */
    markdownItOptions?: Options;

    /**
     * 传递给 DOMPurify.sanitize 的选项。
     * @default {}
     */
    dompurifyOptions?: DOMPurifyConfig;

    /**
     * 当渲染或清理过程中发生错误时调用的回调函数。
     */
    onError?: (error: unknown) => void;

    /**
     * 传递给容器 div 的额外 Tailwind 类名。
     * @default ""
     */
    className?: string;

    /**
     * 用于应用 Tailwind Typography 样式的类名。
     * 可以是 'prose', 'prose-sm', 'prose-lg', 'prose-blue' 等。
     * @default "prose dark:prose-invert"
     * @see https://tailwindcss.com/docs/typography-plugin
     */
    proseClassName?: string;
}

/**
 * 为 Tailwind CSS 优化的 Markdown 渲染组件
 * 依赖 @tailwindcss/typography 插件来提供样式
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
                                                               content = '',
                                                               markdownItOptions = {},
                                                               dompurifyOptions = {},
                                                               onError,
                                                               className = '',
                                                               proseClassName = 'prose-chat dark:prose-invert', // 默认包含深色模式支持
                                                               ...restProps
                                                           }) => {
    const md = useMemo(() => {
        return new MarkdownIt({
            html: true,
            linkify: true,
            typographer: true,
            ...markdownItOptions,
        });
    }, [JSON.stringify(markdownItOptions)]);

    const sanitizedHtml = useMemo(() => {
        if (!content) {
            return {__html: ''};
        }

        try {
            const rawHtml = md.render(content);
            const finalSanitizeOptions: DOMPurifyConfig = {
                ...dompurifyOptions,
            };
            const cleanHtml = DOMPurify.sanitize(rawHtml, finalSanitizeOptions);
            return {__html: cleanHtml as string};
        } catch (error) {
            console.error('MarkdownRenderer: Error during rendering or sanitization:', error);
            onError?.(error);
            return {__html: '<p class="text-red-500 font-semibold">Error rendering Markdown content.</p>'};
        }
    }, [content, md, JSON.stringify(dompurifyOptions), onError]);

    return (
        <div
            className={`
            ${proseClassName} 
            ${className ?? ''} 
            [&_p]:my-1 
            [&_ul]:my-1 
            [&_ol]:my-1 
            [&_pre]:my-2 
            [&_blockquote]:my-1
        `} dangerouslySetInnerHTML={sanitizedHtml}
            {...restProps}
        />
    );
};

export default MarkdownRenderer;
