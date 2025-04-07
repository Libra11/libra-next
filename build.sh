docker build --platform linux/amd64 -t libratool .
docker tag libratool:latest registry.cn-heyuan.aliyuncs.com/libra121/libra-tool:latest
docker push registry.cn-heyuan.aliyuncs.com/libra121/libra-tool:latest                
